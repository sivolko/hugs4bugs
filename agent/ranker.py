"""
ranker.py — Score and select the most significant articles for today's roundup.

Scoring model (configurable weights in config.py):
  - Source credibility  30%
  - Sector impact       30%
  - Recency             25%
  - Sector diversity    15% (bonus for covering different sectors)
"""

import logging
from datetime import datetime, timezone
from typing import Any

import config

logger = logging.getLogger(__name__)

# Scoring weights
W_SOURCE = 0.30
W_SECTOR = 0.30
W_RECENCY = 0.25
W_DIVERSITY = 0.15


def _source_score(source: str) -> float:
    return config.SOURCE_CREDIBILITY.get(source, 5) / 10.0


def _sector_score(sector: str) -> float:
    return config.SECTOR_IMPACT.get(sector, 4) / 10.0


def _recency_score(pub_dt: datetime) -> float:
    """Returns 1.0 for <6h, 0.8 for <12h, 0.6 for <24h, 0.4 for older."""
    age_hours = (datetime.now(timezone.utc) - pub_dt).total_seconds() / 3600
    if age_hours < 6:
        return 1.0
    elif age_hours < 12:
        return 0.8
    elif age_hours < 24:
        return 0.6
    else:
        return 0.4


def score_article(article: dict[str, Any]) -> float:
    source = article.get("source", "")
    sector = article.get("sector", "")
    pub_dt = article.get("_pub_dt", datetime.now(timezone.utc))

    raw = (
        W_SOURCE * _source_score(source)
        + W_SECTOR * _sector_score(sector)
        + W_RECENCY * _recency_score(pub_dt)
    )
    return round(raw, 4)


def select_top_stories(
    articles: list[dict[str, Any]],
    max_stories: int = None,
) -> list[dict[str, Any]]:
    """
    Score all articles, then pick the top N while maximising sector diversity.

    Strategy:
      1. Score every article.
      2. Sort descending by score.
      3. Greedily select articles, giving a +0.15 bonus to the first article
         from each new sector (encourages variety across the roundup).
      4. Return top max_stories.
    """
    if max_stories is None:
        max_stories = config.MAX_STORIES

    if not articles:
        logger.warning("No articles to rank.")
        return []

    # Score all
    for article in articles:
        article["_score"] = score_article(article)

    sorted_articles = sorted(articles, key=lambda a: a["_score"], reverse=True)

    selected: list[dict[str, Any]] = []
    seen_sectors: set[str] = set()

    for article in sorted_articles:
        if len(selected) >= max_stories:
            break

        sector = article.get("sector", "Unknown")

        # Apply diversity bonus for new sectors
        if sector not in seen_sectors:
            article["_score"] += W_DIVERSITY
            seen_sectors.add(sector)

        selected.append(article)
        logger.info(
            "Selected: [%.3f] [%s] [%s] %s",
            article["_score"],
            article.get("source", "?"),
            sector,
            article.get("title", "")[:80],
        )

    return selected
