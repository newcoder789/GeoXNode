import express from 'express';
import Notification from '../models/Notification';
import Event from '../models/Event';
import NotificationService from '../services/notificationService';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

/**
 * @route   POST /api/v1/notifications/subscribe
 * @desc    Subscribe user to notifications
 * @access  Public
 */
router.post('/subscribe', async (req, res, next) => {
  try {
    const {
      email,
      phone,
      name,
      region,
      country,
      coordinates,
      preferences,
      subscriptions
    } = req.body;

    // Check if user already exists
    const existingUser = await Notification.findOne({ 'user.email': email });
    
    if (existingUser) {
      return next(createError('User already subscribed', 400));
    }

    // Create new subscription
    const notification = new Notification({
      user: {
        email,
        phone,
        name,
        region,
        country,
        coordinates
      },
      preferences: {
        emailNotifications: preferences?.emailNotifications ?? true,
        smsNotifications: preferences?.smsNotifications ?? false,
        riskLevels: preferences?.riskLevels ?? ['MEDIUM', 'HIGH', 'CRITICAL'],
        frequency: preferences?.frequency ?? 'IMMEDIATE'
      },
      subscriptions: {
        glaciers: subscriptions?.glaciers ?? [],
        regions: subscriptions?.regions ?? [region],
        globalAlerts: subscriptions?.globalAlerts ?? true
      }
    });

    await notification.save();

    // Send welcome email
    if (notification.preferences.emailNotifications) {
      await NotificationService.sendEmail(
        email,
        'Welcome to Glacier Watch! 🏔️',
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4a90e2; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">🏔️ Welcome to Glacier Watch!</h1>
            </div>
            
            <div style="padding: 20px; border: 1px solid #ddd;">
              <h2 style="color: #333;">Hello ${name},</h2>
              <p>Thank you for subscribing to Glacier Watch! You're now part of our community dedicated to monitoring glacial changes and protecting communities from GLOF risks.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <h3 style="margin-top: 0;">Your Subscription Details:</h3>
                <p><strong>Region:</strong> ${region}, ${country}</p>
                <p><strong>Risk Levels:</strong> ${notification.preferences.riskLevels.join(', ')}</p>
                <p><strong>Frequency:</strong> ${notification.preferences.frequency}</p>
              </div>
              
              <p>You'll receive alerts about:</p>
              <ul>
                <li>Glacial Lake Outburst Floods (GLOFs)</li>
                <li>Glacier retreat and changes</li>
                <li>Weather alerts affecting glaciers</li>
                <li>Emergency situations in your region</li>
              </ul>
              
              <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e8; border-radius: 5px;">
                <p style="margin: 0; color: #2d5a2d;">
                  <strong>Stay Safe:</strong> Always follow local emergency guidelines and evacuate when advised.
                </p>
              </div>
            </div>
          </div>
        `
      );
    }

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Successfully subscribed to Glacier Watch notifications'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/notifications/subscribers
 * @desc    Get all subscribers (Admin only in production)
 * @access  Private
 */
router.get('/subscribers', async (req, res, next) => {
  try {
    const { 
      region, 
      country, 
      status, 
      limit = 50, 
      page = 1 
    } = req.query;

    const filter: any = {};
    
    if (region) filter['user.region'] = new RegExp(region as string, 'i');
    if (country) filter['user.country'] = new RegExp(country as string, 'i');
    if (status) filter.status = status;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const subscribers = await Notification.find(filter)
      .limit(parseInt(limit as string))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(filter);

    res.json({
      success: true,
      data: subscribers,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/v1/notifications/:id/preferences
 * @desc    Update notification preferences
 * @access  Public
 */
router.put('/:id/preferences', async (req, res, next) => {
  try {
    const { preferences } = req.body;
    
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { preferences },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return next(createError('Subscription not found', 404));
    }

    res.json({
      success: true,
      data: notification,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/v1/notifications/:id/subscriptions
 * @desc    Update notification subscriptions
 * @access  Public
 */
router.put('/:id/subscriptions', async (req, res, next) => {
  try {
    const { subscriptions } = req.body;
    
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { subscriptions },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return next(createError('Subscription not found', 404));
    }

    res.json({
      success: true,
      data: notification,
      message: 'Subscriptions updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/v1/notifications/:id
 * @desc    Unsubscribe user
 * @access  Public
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return next(createError('Subscription not found', 404));
    }

    // Send goodbye email
    if (notification.preferences.emailNotifications) {
      await NotificationService.sendEmail(
        notification.user.email,
        'Unsubscribed from Glacier Watch',
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="padding: 20px; border: 1px solid #ddd;">
              <h2 style="color: #333;">Goodbye from Glacier Watch</h2>
              <p>You have been successfully unsubscribed from our notifications.</p>
              <p>If you change your mind, you can always resubscribe at any time.</p>
              <p>Stay safe and take care!</p>
            </div>
          </div>
        `
      );
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/notifications/test
 * @desc    Send test notification (Admin only in production)
 * @access  Private
 */
router.post('/test', async (req, res, next) => {
  try {
    const { email, phone, type = 'EMAIL' } = req.body;

    let success = false;
    let message = '';

    if (type === 'SMS' && phone) {
      success = await NotificationService.sendSMS(
        phone,
        '🧪 Test SMS from Glacier Watch - This is a test notification to verify your SMS settings.'
      );
      message = success ? 'Test SMS sent successfully' : 'Failed to send test SMS';
    } else if (type === 'EMAIL' && email) {
      success = await NotificationService.sendEmail(
        email,
        '🧪 Test Email from Glacier Watch',
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4a90e2; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">🧪 Test Notification</h1>
            </div>
            
            <div style="padding: 20px; border: 1px solid #ddd;">
              <h2 style="color: #333;">Test Email</h2>
              <p>This is a test email to verify your notification settings are working correctly.</p>
              <p>If you received this email, your Glacier Watch notifications are properly configured!</p>
              
              <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                <p style="margin: 0; font-size: 12px; color: #666;">
                  Sent at: ${new Date().toLocaleString()}<br>
                  Glacier Watch Monitoring System
                </p>
              </div>
            </div>
          </div>
        `
      );
      message = success ? 'Test email sent successfully' : 'Failed to send test email';
    } else {
      return next(createError('Invalid test parameters', 400));
    }

    res.json({
      success,
      message,
      type,
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/notifications/stats
 * @desc    Get notification statistics
 * @access  Private
 */
router.get('/stats', async (req, res, next) => {
  try {
    const totalSubscribers = await Notification.countDocuments();
    const activeSubscribers = await Notification.countDocuments({ status: 'ACTIVE' });
    
    const regionStats = await Notification.aggregate([
      {
        $group: {
          _id: '$user.region',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const preferenceStats = await Notification.aggregate([
      {
        $group: {
          _id: null,
          emailEnabled: { $sum: { $cond: ['$preferences.emailNotifications', 1, 0] } },
          smsEnabled: { $sum: { $cond: ['$preferences.smsNotifications', 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total: totalSubscribers,
        active: activeSubscribers,
        regionDistribution: regionStats,
        preferences: preferenceStats[0] || { emailEnabled: 0, smsEnabled: 0 }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
