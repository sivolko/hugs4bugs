"""
notifier.py — Send an email notification after the draft is saved.

Uses Gmail SMTP with an App Password (not the regular Gmail password).
If EMAIL_APP_PASSWORD is not set, the notification step is skipped silently.
"""

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any

import config

logger = logging.getLogger(__name__)


def send_email_notification(
    post_title: str,
    github_url: str,
    selected_articles: list[dict[str, Any]],
    today_str: str,
) -> None:
    """
    Send a notification email to config.EMAIL_TO with:
    - The generated post title
    - Link to the GitHub draft
    - List of source articles covered
    - Quick summary of sectors covered
    """
    if not config.EMAIL_APP_PASSWORD:
        logger.info("EMAIL_APP_PASSWORD not set. Skipping email notification.")
        return

    subject = f"[hugs4bugs] Draft ready: {post_title} ({today_str})"

    # Build article list
    article_rows = ""
    for i, article in enumerate(selected_articles, start=1):
        article_rows += (
            f"<tr>"
            f"<td>{i}</td>"
            f"<td><a href='{article.get('link', '#')}'>{article.get('title', 'N/A')}</a></td>"
            f"<td>{article.get('source', 'N/A')}</td>"
            f"<td>{article.get('sector', 'N/A')}</td>"
            f"<td>{article.get('pubDate', 'N/A')}</td>"
            f"</tr>"
        )

    sectors = list({a.get("sector", "Unknown") for a in selected_articles})

    html_body = f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
         color: #1a1a2e; background: #f5f5f5; margin: 0; padding: 20px; }}
  .card {{ background: white; border-radius: 10px; padding: 30px;
           max-width: 700px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
  h1 {{ font-size: 20px; color: #1a1a2e; margin-bottom: 6px; }}
  .badge {{ display: inline-block; background: #4caf50; color: white; padding: 3px 10px;
            border-radius: 12px; font-size: 12px; margin-bottom: 20px; }}
  a.btn {{ display: inline-block; background: #1a1a2e; color: white;
           padding: 12px 24px; border-radius: 6px; text-decoration: none;
           font-weight: 600; margin: 16px 0; }}
  table {{ width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }}
  th {{ background: #1a1a2e; color: white; padding: 8px 12px; text-align: left; }}
  td {{ padding: 8px 12px; border-bottom: 1px solid #eee; }}
  tr:nth-child(even) td {{ background: #f9f9f9; }}
  .sectors {{ color: #666; font-size: 13px; margin-top: 16px; }}
  .footer {{ color: #999; font-size: 12px; margin-top: 24px; border-top: 1px solid #eee;
             padding-top: 16px; }}
</style>
</head>
<body>
<div class="card">
  <div class="badge">Draft Ready</div>
  <h1>{post_title}</h1>
  <p>Your daily threat intelligence agent has finished running for <strong>{today_str}</strong>.
     A new blog draft has been committed to your Jekyll blog repository.</p>

  <a class="btn" href="{github_url}">View Draft on GitHub</a>

  <p class="sectors">
    <strong>Sectors covered:</strong> {', '.join(sectors)}
  </p>

  <h2 style="font-size:15px; margin-top:24px;">Stories Included</h2>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Title</th>
        <th>Source</th>
        <th>Sector</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {article_rows}
    </tbody>
  </table>

  <div class="footer">
    Sent by your Threat Intel Blog Agent. To review and publish the draft,
    open your CMS at <a href="https://cms.hugs4bugs.me/">cms.hugs4bugs.me</a>
    or edit the file directly in the GitHub repository.
  </div>
</div>
</body>
</html>
"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = config.EMAIL_FROM
    msg["To"] = config.EMAIL_TO
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=30) as server:
            server.login(config.EMAIL_FROM, config.EMAIL_APP_PASSWORD)
            server.sendmail(config.EMAIL_FROM, config.EMAIL_TO, msg.as_string())
        logger.info("Email notification sent to %s", config.EMAIL_TO)
    except smtplib.SMTPAuthenticationError:
        logger.error(
            "Gmail authentication failed. Make sure you are using an App Password, "
            "not your regular Gmail password. "
            "Generate one at: https://myaccount.google.com/apppasswords"
        )
    except Exception as exc:
        logger.error("Failed to send email notification: %s", exc)
