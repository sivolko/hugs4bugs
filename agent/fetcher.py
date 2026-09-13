"""
fetcher.py — Pull the latest articles from the threat intel dashboard.

The /api/feeds endpoint returns a JSON array. Each article has:
  title, description, link, pubDate, source, sector
"""

import logging
from datetime import datetime, timezone, timedelta
from typing import Any

import httpx

import config

logger = logging.getLogger(__name__)


def fetch_articles() -> list[dict[str, Any]]:
    """
    Fetch all articles from the threat intel dashboard and filter
    to those published within the configured lookback window.
    """
    logger.info("Fetching feed from %s", config.FEED_API_URL)

    try:
        # The Render free tier may take ~30s to wake up on first request.
        response = httpx.get(config.FEED_API_URL, timeout=60)
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        logger.error("Feed API returned HTTP %s: %s", exc.response.status_code, exc)
        raise
    except httpx.RequestError as exc:
        logger.error("Network error fetching feed: %s", exc)
        raise

    data = response.json()
    articles: list[dict[str, Any]] = data.get("articles", [])
    logger.info("Received %d total articles from feed", len(articles))

    cutoff = datetime.now(timezone.utc) - timedelta(hours=config.LOOKBACK_HOURS)
    recent: list[dict[str, Any]] = []

    for article in articles:
        pub_str = article.get("pubDate", "")
        try:
            # Format from feed: "2026-09-13 10:26"
            pub_dt = datetime.strptime(pub_str, "%Y-%m-%d %H:%M").replace(
                tzinfo=timezone.utc
            )
        except ValueError:
            # If we can't parse the date, include the article anyway
            pub_dt = datetime.now(timezone.utc)

        article["_pub_dt"] = pub_dt

        if pub_dt >= cutoff:
            recent.append(article)

    logger.info(
        "Filtered to %d articles within the last %d hours",
        len(recent),
        config.LOOKBACK_HOURS,
    )

    # If nothing in the lookback window, extend to 48h as fallback
    # (handles weekends and bank holidays where the feed goes quiet)
    if not recent:
        logger.warning(
            "No articles within %dh window. Falling back to 48h.", config.LOOKBACK_HOURS
        )
        cutoff_48 = datetime.now(timezone.utc) - timedelta(hours=48)
        recent = [a for a in articles if a["_pub_dt"] >= cutoff_48]
        logger.info("Fallback found %d articles in 48h window", len(recent))

    return recent
