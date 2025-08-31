import twilio from 'twilio';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { INotification } from '../models/Notification';
import { IEvent } from '../models/Event';

dotenv.config();

// Twilio client
const twilioClient = twilio(
  process.env['TWILIO_ACCOUNT_SID'],
  process.env['TWILIO_AUTH_TOKEN']
);

// Email transporter
const emailTransporter = nodemailer.createTransport({
  host: process.env['EMAIL_HOST'],
  port: parseInt(process.env['EMAIL_PORT'] || '587'),
  secure: false,
  auth: {
    user: process.env['EMAIL_USER'],
    pass: process.env['EMAIL_PASS']
  }
});

export interface NotificationPayload {
  to: string;
  subject: string;
  message: string;
  type: 'SMS' | 'EMAIL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AlertNotification {
  event: IEvent;
  subscribers: INotification[];
  message: string;
}

export class NotificationService {
  /**
   * Send SMS notification via Twilio
   */
  static async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      if (!process.env['TWILIO_ACCOUNT_SID'] || !process.env['TWILIO_AUTH_TOKEN']) {
        console.warn('⚠️ Twilio credentials not configured');
        return false;
      }

      const fromNumber = process.env['TWILIO_PHONE_NUMBER'];
      if (!fromNumber) {
        console.warn('⚠️ Twilio phone number not configured');
        return false;
      }

      const result = await twilioClient.messages.create({
        body: message,
        from: fromNumber,
        to: to
      });

      console.log(`📱 SMS sent successfully to ${to}:`, result.sid);
      return true;
    } catch (error) {
      console.error('❌ Error sending SMS:', error);
      return false;
    }
  }

  /**
   * Send email notification
   */
  static async sendEmail(to: string, subject: string, message: string): Promise<boolean> {
    try {
      if (!process.env['EMAIL_USER'] || !process.env['EMAIL_PASS']) {
        console.warn('⚠️ Email credentials not configured');
        return false;
      }

      const mailOptions = {
        from: process.env['EMAIL_FROM'] || process.env['EMAIL_USER'],
        to: to,
        subject: subject,
        html: message,
        text: message.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
      };

      const result = await emailTransporter.sendMail(mailOptions);
      console.log(`📧 Email sent successfully to ${to}:`, result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }

  /**
   * Send notification based on type
   */
  static async sendNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      if (payload.type === 'SMS') {
        return await this.sendSMS(payload.to, payload.message);
      } else if (payload.type === 'EMAIL') {
        return await this.sendEmail(payload.to, payload.subject, payload.message);
      }
      return false;
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      return false;
    }
  }

  /**
   * Send emergency alerts for critical events
   */
  static async sendEmergencyAlert(alert: AlertNotification): Promise<{
    success: number;
    failed: number;
    total: number;
  }> {
    const results = {
      success: 0,
      failed: 0,
      total: alert.subscribers.length
    };

    const alertMessage = this.formatAlertMessage(alert.event, alert.message);

    for (const subscriber of alert.subscribers) {
      try {
        let sent = false;

        // Send email if enabled
        if (subscriber.preferences.emailNotifications) {
          sent = await this.sendEmail(
            subscriber.user.email,
            `🚨 EMERGENCY ALERT: ${alert.event.title}`,
            alertMessage
          );
        }

        // Send SMS if enabled
        if (subscriber.preferences.smsNotifications && subscriber.user.phone) {
          const smsSent = await this.sendSMS(
            subscriber.user.phone,
            `🚨 ALERT: ${alert.event.title} - ${alert.event.description}`
          );
          sent = sent || smsSent;
        }

        if (sent) {
          results.success++;
        } else {
          results.failed++;
        }
      } catch (error) {
        console.error('❌ Error sending alert to subscriber:', error);
        results.failed++;
      }
    }

    console.log(`📢 Emergency alert sent: ${results.success}/${results.total} successful`);
    return results;
  }

  /**
   * Format alert message with event details
   */
  private static formatAlertMessage(event: IEvent, customMessage: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ff4444; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🚨 EMERGENCY ALERT</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #333;">${event.title}</h2>
          <p><strong>Type:</strong> ${event.type}</p>
          <p><strong>Severity:</strong> ${event.severity}</p>
          <p><strong>Location:</strong> ${event.location.region}, ${event.location.country}</p>
          <p><strong>Time:</strong> ${event.details.startTime.toLocaleString()}</p>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Description:</strong></p>
            <p>${event.description}</p>
          </div>
          
          ${customMessage ? `<p><strong>Additional Information:</strong> ${customMessage}</p>` : ''}
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              This alert was sent by Glacier Watch monitoring system.<br>
              Please take necessary precautions and follow local emergency guidelines.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Send daily digest to subscribers
   */
  static async sendDailyDigest(subscribers: INotification[], events: IEvent[]): Promise<void> {
    // Implementation for daily digest notifications
    console.log('📅 Daily digest feature not yet implemented');
  }

  /**
   * Send weekly summary to subscribers
   */
  static async sendWeeklySummary(subscribers: INotification[], events: IEvent[]): Promise<void> {
    // Implementation for weekly summary notifications
    console.log('📊 Weekly summary feature not yet implemented');
  }
}

export default NotificationService;
