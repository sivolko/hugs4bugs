"""
writer.py — Send selected articles to Claude Sonnet and get back a full blog post.

Uses the Anthropic Messages API with:
  - System prompt: full hugs4bugs blog writer skill (prompts/blog_writer.txt)
  - User message: all selected articles with scraped full text
  - Extended thinking enabled for deeper analysis
"""

import logging
import re
from pathlib import Path
from typing import Any

import anthropic

import config

logger = logging.getLogger(__name__)

# Load the system prompt once at module import time
_PROMPT_PATH = Path(__file__).parent / "prompts" / "blog_writer.txt"
_SYSTEM_PROMPT: str = _PROMPT_PATH.read_text(encoding="utf-8")


def _build_user_message(
    articles: list[dict[str, Any]],
    today_str: str,
) -> str:
    """
    Construct the user-turn message: today's date + all article content.
    """
    parts = [
        f"Today's date: {today_str}",
        f"Number of articles to cover: {len(articles)}",
        "",
        "Write a comprehensive threat intelligence roundup blog post covering ALL of the "
        "articles below. Follow the system prompt instructions exactly.",
        "",
        "=" * 60,
    ]

    for i, article in enumerate(articles, start=1):
        parts += [
            "",
            f"ARTICLE {i}:",
            f"Title:   {article.get('title', 'N/A')}",
            f"Source:  {article.get('source', 'N/A')}",
            f"Sector:  {article.get('sector', 'N/A')}",
            f"Date:    {article.get('pubDate', 'N/A')}",
            f"URL:     {article.get('link', 'N/A')}",
            "",
            "Full text:",
            article.get("_full_text") or article.get("description") or "(no content)",
            "",
            "-" * 60,
        ]

    return "\n".join(parts)


def extract_frontmatter(post_markdown: str) -> dict[str, str]:
    """
    Parse the YAML frontmatter block from the generated post.
    Returns a dict with keys like 'title', 'date', 'description', etc.
    """
    match = re.search(r"```yaml\s*\n(---\n.*?---)\s*\n```", post_markdown, re.DOTALL)
    if not match:
        # Try bare frontmatter (sometimes Claude omits the code fence)
        match = re.search(r"^(---\n.*?---)", post_markdown, re.DOTALL | re.MULTILINE)

    if not match:
        logger.warning("Could not find frontmatter block in generated post.")
        return {}

    frontmatter_text = match.group(1)
    result: dict[str, str] = {}

    for line in frontmatter_text.split("\n"):
        if ":" in line and not line.startswith("-") and not line.startswith("---"):
            key, _, value = line.partition(":")
            result[key.strip()] = value.strip().strip('"')

    return result


def generate_post(
    articles: list[dict[str, Any]],
    today_str: str,
) -> tuple[str, dict[str, str]]:
    """
    Call Claude Sonnet with the selected articles and return:
      (full_markdown_post, frontmatter_dict)
    """
    client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

    user_message = _build_user_message(articles, today_str)

    logger.info(
        "Sending %d articles to Claude (%s). Input length: %d chars.",
        len(articles),
        config.CLAUDE_MODEL,
        len(user_message),
    )

    # Use extended thinking for deeper technical analysis.
    # Budget: 8000 tokens for reasoning, 8000 for visible output.
    # Falls back to standard mode if the model doesn't support thinking.
    try:
        response = client.messages.create(
            model=config.CLAUDE_MODEL,
            max_tokens=16000,
            thinking={
                "type": "enabled",
                "budget_tokens": 8000,
            },
            system=_SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": user_message}
            ],
        )
    except anthropic.BadRequestError as exc:
        # Model does not support extended thinking — retry without it
        logger.warning(
            "Extended thinking not supported by %s (%s). Retrying without thinking.",
            config.CLAUDE_MODEL,
            exc,
        )
        response = client.messages.create(
            model=config.CLAUDE_MODEL,
            max_tokens=8192,
            system=_SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": user_message}
            ],
        )

    # Extract only the text blocks from the response
    # (thinking blocks contain Claude's internal reasoning — we skip those)
    post_parts = []
    for block in response.content:
        if block.type == "text":
            post_parts.append(block.text)

    post_markdown = "\n".join(post_parts)

    logger.info(
        "Claude returned %d characters. Input tokens: %d, Output tokens: %d.",
        len(post_markdown),
        response.usage.input_tokens,
        response.usage.output_tokens,
    )

    frontmatter = extract_frontmatter(post_markdown)
    title = frontmatter.get("title", "Threat Intelligence Roundup")
    logger.info("Generated post title: %s", title)

    return post_markdown, frontmatter
