"""
publisher.py — Commit the generated blog post as a Jekyll draft to GitHub.

The Jekyll blog repository holds posts as markdown files.
Drafts go into the _drafts/ folder with `published: false` in frontmatter.

This module uses the GitHub Contents API to create the file:
  PUT /repos/{owner}/{repo}/contents/{path}

No CMS API reverse-engineering needed — we write directly to the git repo.
"""

import base64
import json
import logging
import re
from datetime import datetime, timezone

import httpx

import config

logger = logging.getLogger(__name__)

_GH_API = "https://api.github.com"


def _slug(title: str) -> str:
    """Turn a post title into a URL-safe slug for the filename."""
    slug = title.lower()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"\s+", "-", slug).strip("-")
    slug = slug[:60]  # keep filenames reasonably short
    return slug


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {config.BLOG_GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def _get_existing_sha(owner: str, repo: str, path: str) -> str | None:
    """
    Return the blob SHA of an existing file, or None if it doesn't exist.
    The GitHub API requires the current SHA to update an existing file.
    """
    url = f"{_GH_API}/repos/{owner}/{repo}/contents/{path}"
    params = {"ref": config.BLOG_BRANCH}
    response = httpx.get(url, headers=_headers(), params=params, timeout=30)

    if response.status_code == 200:
        return response.json().get("sha")
    return None


def publish_draft(
    post_markdown: str,
    frontmatter: dict[str, str],
    today_str: str,
) -> str:
    """
    Commit the blog post as a Jekyll draft to the GitHub repository.

    Returns the URL of the created/updated file on GitHub.
    """
    owner, repo = config.BLOG_GITHUB_REPO.split("/", 1)

    title = frontmatter.get("title", f"Threat Intelligence Roundup {today_str}")
    filename = f"{today_str}-{_slug(title)}.md"
    file_path = f"{config.DRAFTS_PATH}/{filename}"

    # Ensure the post has the frontmatter embedded at the top.
    # Gemini returns the frontmatter inside a ```yaml block at the bottom.
    # We need to move it to the top as bare YAML for Jekyll to parse.
    post_body = _prepare_jekyll_post(post_markdown, frontmatter, today_str)

    encoded_content = base64.b64encode(post_body.encode("utf-8")).decode("ascii")

    # Check if file already exists (idempotent re-runs)
    existing_sha = _get_existing_sha(owner, repo, file_path)

    commit_message = f"draft: threat intel roundup {today_str} [automated]"

    payload: dict = {
        "message": commit_message,
        "content": encoded_content,
        "branch": config.BLOG_BRANCH,
    }
    if existing_sha:
        payload["sha"] = existing_sha
        logger.info("Updating existing draft at %s", file_path)
    else:
        logger.info("Creating new draft at %s", file_path)

    url = f"{_GH_API}/repos/{owner}/{repo}/contents/{file_path}"
    response = httpx.put(url, headers=_headers(), json=payload, timeout=30)

    if response.status_code not in (200, 201):
        logger.error(
            "GitHub API error %s: %s", response.status_code, response.text[:500]
        )
        response.raise_for_status()

    result = response.json()
    html_url: str = result.get("content", {}).get("html_url", "")
    logger.info("Draft committed to GitHub: %s", html_url)

    return html_url


def _prepare_jekyll_post(
    post_markdown: str,
    frontmatter: dict[str, str],
    today_str: str,
) -> str:
    """
    Prepare the final Jekyll post:
    1. Strip the frontmatter ```yaml block from wherever Gemini put it.
    2. Build a clean YAML frontmatter block.
    3. Prepend it to the post body.
    """
    # Strip any ```yaml...``` blocks (Gemini puts frontmatter here)
    body = re.sub(r"```yaml\s*\n---\n.*?---\s*\n```", "", post_markdown, flags=re.DOTALL)
    body = body.strip()

    # Build clean frontmatter
    title = frontmatter.get("title", f"Threat Intelligence Roundup {today_str}")
    subtitle = frontmatter.get("subtitle", "Deep analysis of this week's most critical security stories")
    description = frontmatter.get("description", "Weekly threat intelligence roundup with deep technical analysis.")
    category = frontmatter.get("category", "security")

    # Collect tags
    tags_line = frontmatter.get("tags", "")
    default_tags = ["threat-intelligence", "security-roundup"]
    if tags_line:
        extra = [t.strip("- ") for t in tags_line.split(",") if t.strip()]
        all_tags = list(dict.fromkeys(default_tags + extra))
    else:
        all_tags = default_tags

    tags_yaml = "\n".join(f"  - {tag}" for tag in all_tags if tag)

    now_utc = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S +0000")

    fm = f"""---
title: "{title}"
date: {now_utc}
category: {category}
tags:
{tags_yaml}
layout: post
subtitle: "{subtitle}"
description: "{description}"
image: ""
optimized_image: ""
author: Shubhendu Shubham
published: false
---

"""

    return fm + body
