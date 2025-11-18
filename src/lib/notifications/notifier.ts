import { Resend } from 'resend';
import axios from 'axios';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface NotificationData {
  userId: string;
  postTitle: string;
  postUrl: string;
  subreddit: string;
  sentiment?: string;
  keywords?: string[];
}

/**
 * Send email notification via Resend
 */
export async function sendEmailNotification(
  to: string,
  data: NotificationData
): Promise<void> {
  try {
    const keywordsHtml = data.keywords
      ? `<p><strong>Keywords matched:</strong> ${data.keywords.join(', ')}</p>`
      : '';
    const sentimentHtml = data.sentiment
      ? `<p><strong>Sentiment:</strong> ${data.sentiment}</p>`
      : '';

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'notifications@reddit-monitor.com',
      to,
      subject: `New opportunity: ${data.postTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Reddit Opportunity Detected!</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${data.postTitle}</h3>
            <p><strong>Subreddit:</strong> r/${data.subreddit}</p>
            ${sentimentHtml}
            ${keywordsHtml}
          </div>
          <a href="${data.postUrl}"
             style="background: #0079d3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Post on Reddit
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This notification was sent by Finance Scoop.
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings">Manage notification settings</a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * Send Slack notification via webhook
 */
export async function sendSlackNotification(data: NotificationData): Promise<void> {
  if (!process.env.SLACK_WEBHOOK_URL) {
    console.warn('Slack webhook URL not configured');
    return;
  }

  try {
    const sentimentText = data.sentiment ? `*Sentiment:* ${data.sentiment}\n` : '';
    const keywordsText = data.keywords ? `*Keywords:* ${data.keywords.join(', ')}\n` : '';

    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `*New Reddit Opportunity!*`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎯 New Reddit Opportunity Detected',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${data.postTitle}*\n\n*Subreddit:* r/${data.subreddit}\n${sentimentText}${keywordsText}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View on Reddit',
              },
              url: data.postUrl,
              style: 'primary',
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    throw error;
  }
}

/**
 * Send notification to all configured channels
 */
export async function sendNotification(
  email: string | null,
  data: NotificationData,
  channels: { email: boolean; slack: boolean }
): Promise<void> {
  const promises: Promise<void>[] = [];

  if (channels.email && email) {
    promises.push(sendEmailNotification(email, data));
  }

  if (channels.slack) {
    promises.push(sendSlackNotification(data));
  }

  await Promise.allSettled(promises);
}
