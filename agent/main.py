"""
main.py — Orchestrates the full threat intel blog agent pipeline.

Pipeline:
  1. Fetch articles from threat intel dashboard
  2. Score and select top stories (by sector diversity + impact)
  3. Scrape full article text from source URLs
  4. Generate blog post via Gemini
  5. Commit draft to Jekyll blog GitHub repo
  6. Send email notification

Usage:
  python main.py             # Full run
  python main.py --dry-run   # Run everything except the GitHub commit and email
"""

import argparse
import logging
import sys
from datetime import datetime, timezone

import config  # noqa: F401 — validates env vars on import
import fetcher
import notifier
import publisher
import ranker
import scraper
import writer

# ── Logging setup ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger("main")


def run(dry_run: bool = False) -> None:
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    logger.info("=" * 60)
    logger.info("Threat Intel Blog Agent starting — %s", today_str)
    if dry_run:
        logger.info("DRY RUN mode — no GitHub commit, no email.")
    logger.info("=" * 60)

    # Step 1 — Fetch
    logger.info("Step 1/6 — Fetching articles from threat intel dashboard")
    articles = fetcher.fetch_articles()
    if not articles:
        logger.error("No articles found. Exiting.")
        sys.exit(1)

    # Step 2 — Rank and select
    logger.info("Step 2/6 — Ranking and selecting top stories")
    selected = ranker.select_top_stories(articles)
    if not selected:
        logger.error("Ranker returned no stories. Exiting.")
        sys.exit(1)
    logger.info("Selected %d stories for this roundup.", len(selected))

    # Step 3 — Scrape full article text
    logger.info("Step 3/6 — Scraping full article text")
    selected = scraper.scrape_all(selected)

    # Step 4 — Generate blog post via Gemini
    logger.info("Step 4/6 — Generating blog post via Gemini (%s)", config.GEMINI_MODEL)
    post_markdown, frontmatter = writer.generate_post(selected, today_str)

    title = frontmatter.get("title", f"Threat Intelligence Roundup {today_str}")
    logger.info("Generated post: %s", title)

    if dry_run:
        # Print the post to stdout so you can review it
        print("\n" + "=" * 60)
        print("GENERATED POST (dry run — not committed):")
        print("=" * 60)
        print(post_markdown)
        print("=" * 60)
        logger.info("Dry run complete. No changes made.")
        return

    # Step 5 — Publish draft to GitHub
    logger.info("Step 5/6 — Committing draft to GitHub repo: %s", config.BLOG_GITHUB_REPO)
    github_url = publisher.publish_draft(post_markdown, frontmatter, today_str)
    logger.info("Draft published: %s", github_url)

    # Step 6 — Send email notification
    logger.info("Step 6/6 — Sending email notification to %s", config.EMAIL_TO)
    notifier.send_email_notification(title, github_url, selected, today_str)

    logger.info("=" * 60)
    logger.info("Agent run complete.")
    logger.info("Draft: %s", github_url)
    logger.info("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Threat Intel Blog Agent — daily security roundup generator"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run the full pipeline but skip GitHub commit and email. Prints the post to stdout.",
    )
    args = parser.parse_args()
    run(dry_run=args.dry_run)
