"""
scraper.py — Fetch full article body text from source URLs.

Uses trafilatura, which is purpose-built for extracting clean article text
from any URL (handles news sites, blogs, research portals).

Falls back to the feed description if:
  - The source blocks bots (403/429)
  - The page is JavaScript-rendered with no server-side text
  - trafilatura extracts less than 200 characters
"""

import logging
from typing import Any

import httpx
import trafilatura

logger = logging.getLogger(__name__)

# Sites that commonly block scrapers — use feed description instead
SKIP_SCRAPE_DOMAINS = {
    "darkreading.com",   # heavy JS, thin server-side text
}

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; ThreatIntelAgent/1.0; "
        "+https://hugs4bugs.me)"
    )
}


def _domain(url: str) -> str:
    try:
        from urllib.parse import urlparse
        return urlparse(url).netloc.lstrip("www.")
    except Exception:
        return ""


def scrape_article(article: dict[str, Any]) -> str:
    """
    Return the full cleaned article text for a given article dict.

    Preference order:
      1. trafilatura extraction from the article URL
      2. Feed description (fallback)
    """
    url: str = article.get("link", "")
    description: str = article.get("description", "")
    title: str = article.get("title", "")
    domain = _domain(url)

    if not url:
        logger.warning("No URL for article '%s'. Using description only.", title)
        return description

    if domain in SKIP_SCRAPE_DOMAINS:
        logger.info("Skipping scrape for %s (blocked domain). Using description.", domain)
        return f"{title}\n\n{description}"

    try:
        response = httpx.get(url, headers=_HEADERS, timeout=30, follow_redirects=True)
        response.raise_for_status()
        html = response.text
    except httpx.HTTPStatusError as exc:
        logger.warning(
            "HTTP %s fetching %s. Using feed description.", exc.response.status_code, url
        )
        return f"{title}\n\n{description}"
    except httpx.RequestError as exc:
        logger.warning("Network error fetching %s: %s. Using feed description.", url, exc)
        return f"{title}\n\n{description}"

    extracted = trafilatura.extract(
        html,
        include_comments=False,
        include_tables=True,
        no_fallback=False,
        favor_recall=True,
    )

    if not extracted or len(extracted.strip()) < 200:
        logger.info(
            "trafilatura returned thin content for %s (%d chars). Using feed description.",
            url,
            len(extracted or ""),
        )
        return f"{title}\n\n{description}"

    logger.info("Scraped %d characters from %s", len(extracted), url)
    return extracted


def scrape_all(articles: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Scrape full text for each article and attach it as '_full_text'."""
    for article in articles:
        article["_full_text"] = scrape_article(article)
    return articles
