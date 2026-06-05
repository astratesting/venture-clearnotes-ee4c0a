import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from datetime import datetime


class EmailService:
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@clearnotes.app")

    def send_email(
        self,
        to_emails: List[str],
        subject: str,
        html_body: str,
        text_body: Optional[str] = None
    ) -> bool:
        """
        Send an email to the specified recipients
        """
        try:
            if not self.smtp_user or not self.smtp_password:
                print("Email credentials not configured")
                # In development, just print the email
                print(f"\n=== EMAIL WOULD BE SENT ===")
                print(f"To: {', '.join(to_emails)}")
                print(f"Subject: {subject}")
                print(f"Body: {text_body or html_body[:500]}...")
                print("===========================\n")
                return True

            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"ClearNotes <{self.from_email}>"
            msg["To"] = ", ".join(to_emails)

            if text_body:
                msg.attach(MIMEText(text_body, "plain"))
            msg.attach(MIMEText(html_body, "html"))

            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.from_email, to_emails, msg.as_string())

            return True

        except Exception as e:
            print(f"Email sending error: {str(e)}")
            return False

    def send_action_items_email(
        self,
        to_emails: List[str],
        meeting_title: str,
        action_items: List[dict],
        summary: Optional[str] = None,
        meeting_date: Optional[datetime] = None,
        signature: Optional[str] = None
    ) -> bool:
        """
        Send action items via email to meeting participants
        """
        subject = f"Action Items from {meeting_title}"

        # Build HTML body
        html_body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                h2 {{ color: #0ea5e9; }}
                .action-item {{
                    background: #f8fafc;
                    padding: 15px;
                    margin: 10px 0;
                    border-left: 4px solid #0ea5e9;
                    border-radius: 4px;
                }}
                .priority-high {{ border-left-color: #ef4444; }}
                .priority-medium {{ border-left-color: #f59e0b; }}
                .priority-low {{ border-left-color: #22c55e; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Action Items from {meeting_title}</h2>
                <p><strong>Meeting Date:</strong> {meeting_date.strftime('%B %d, %Y') if meeting_date else 'Not specified'}</p>
        """

        if summary:
            html_body += f"""
                <h3>Meeting Summary</h3>
                <p>{summary[:500]}{'...' if len(summary) > 500 else ''}</p>
            """

        html_body += "<h3>Action Items</h3>"

        for item in action_items:
            priority_class = f"priority-{item.get('priority', 'MEDIUM').lower()}" if item.get('priority') else ""
            assignee = f"<br><strong>Assigned to:</strong> @{item['assignee']}" if item.get('assignee') else ""
            deadline = f"<br><strong>Deadline:</strong> {item['deadline']}" if item.get('deadline') else ""
            priority = f"<br><strong>Priority:</strong> {item.get('priority', 'MEDIUM')}"

            html_body += f"""
                <div class="action-item {priority_class}">
                    <strong>{item['content']}</strong>
                    {assignee}
                    {deadline}
                    {priority}
                </div>
            """

        html_body += """
                <div class="footer">
                    <p>Sent via ClearNotes - Your AI Meeting Notetaker</p>
        """

        if signature:
            html_body += f"<p>{signature}</p>"

        html_body += """
                </div>
            </div>
        </body>
        </html>
        """

        return self.send_email(to_emails, subject, html_body)

    def send_daily_digest(
        self,
        to_email: str,
        user_name: str,
        pending_items: List[dict],
        completed_items: List[dict]
    ) -> bool:
        """
        Send daily digest of action items
        """
        subject = f"Your Daily Action Items Digest - {datetime.now().strftime('%B %d')}"

        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #0ea5e9;">Good Morning, {user_name}!</h2>
                <p>Here's your action items digest for today.</p>

                <h3>Pending ({len(pending_items)})</h3>
        """

        for item in pending_items:
            html_body += f"""
                <div style="background: #f8fafc; padding: 10px; margin: 5px 0; border-left: 3px solid #f59e0b;">
                    • {item['content']} <em>(from {item.get('meeting_title', 'Unknown meeting')})</em>
                </div>
            """

        html_body += f"""
                <h3>Completed ({len(completed_items)})</h3>
        """

        for item in completed_items:
            html_body += f"""
                <div style="background: #f8fafc; padding: 10px; margin: 5px 0; border-left: 3px solid #22c55e; text-decoration: line-through;">
                    • {item['content']}
                </div>
            """

        html_body += """
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                    <p>Sent via ClearNotes</p>
                </div>
            </div>
        </body>
        </html>
        """

        return self.send_email([to_email], subject, html_body)


# Global instance
email_service = EmailService()
