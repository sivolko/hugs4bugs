"""
config.py — Load and validate all environment variables.

Every other module imports from here. Nothing reads os.environ directly.
"""

import os
from dotenv import load_dotenv

load_dotenv()


def _require(key: str) -> str:
    """Raise a clear error if a required env var is missing."""
    value = os.getenv(key, "").strip()
    if not value:
        raise EnvironmentError(
            f"Required environment variable '{key}' is not set. "
            f"See .env.example for setup instructions."
        )
    return value


def _optional(key: str, default: str) -> str:
    return os.getenv(key, default).strip() or default


# ── LLM — Anthropic Claude ────────────────────────────────────────────────────
ANTHROPIC_API_KEY: str = _require("ANTHROPIC_API_KEY")

# Claude model ID. Claude Sonnet 4.5 is the current Sonnet tier.
# Override via env if Anthropic releases a newer version.
# Check available models at: https://docs.anthropic.com/en/docs/about-claude/models
CLAUDE_MODEL: str = _optional("CLAUDE_MODEL", "claude-sonnet-4-5")

# ── GitHub / Jekyll blog ──────────────────────────────────────────────────────
# Since the agent lives IN the blog repo, the workflow uses GITHUB_TOKEN (built-in).
# For local runs, set BLOG_GITHUB_TOKEN to a PAT with Contents write scope.
BLOG_GITHUB_REPO: str = _optional("BLOG_GITHUB_REPO", "sivolko/hugs4bugs")
BLOG_GITHUB_TOKEN: str = _require("BLOG_GITHUB_TOKEN")
BLOG_BRANCH: str = _optional("BLOG_BRANCH", "main")
DRAFTS_PATH: str = _optional("DRAFTS_PATH", "_drafts")

# ── Email ─────────────────────────────────────────────────────────────────────
EMAIL_TO: str = _optional("EMAIL_TO", "shubhendushubham98@gmail.com")
EMAIL_FROM: str = _optional("EMAIL_FROM", "shubhendushubham98@gmail.com")
EMAIL_APP_PASSWORD: str = _optional("EMAIL_APP_PASSWORD", "")

# ── Agent behaviour ───────────────────────────────────────────────────────────
LOOKBACK_HOURS: int = int(_optional("LOOKBACK_HOURS", "24"))
MAX_STORIES: int = int(_optional("MAX_STORIES", "5"))

# Threat intel dashboard API
FEED_API_URL: str = "https://threat-intel-dashbaord.onrender.com/api/feeds"

# Source credibility scores (higher = more trusted)
SOURCE_CREDIBILITY: dict[str, int] = {
    "Unit 42": 10,
    "Check Point": 10,
    "Microsoft Security": 9,
    "CrowdStrike": 9,
    "SANS ISC": 8,
    "Dark Reading": 7,
    "Bleeping Computer": 7,
    "WeLiveSecurity": 6,
}

# Sector impact scores (higher = more significant)
SECTOR_IMPACT: dict[str, int] = {
    "APT / Nation-State": 10,
    "Supply Chain": 9,
    "Ransomware": 9,
    "Vulnerability": 8,
    "Data Breach": 8,
    "Malware": 7,
    "Phishing": 7,
    "Cloud Security": 7,
    "Identity & Access": 7,
    "Check Point Research Publications": 7,
    "Clickfix": 6,
    "ICS / Advisory": 6,
    "AI / ML Threats": 6,
    "Social Engineering": 6,
    "Incident Analysis": 5,
    "Incident Response": 5,
    "General Security": 4,
    "General": 4,
    "Digital Security": 4,
    "Privacy": 4,
    "Business Security": 4,
    "Microsoft Security": 5,
    "Frontier Ai Models": 5,
}
