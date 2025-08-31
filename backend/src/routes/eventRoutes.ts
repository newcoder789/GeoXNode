import express from 'express';
import Event from '../models/Event';
import Notification from '../models/Notification';
import NotificationService from '../services/notificationService';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

/**
 * @route   GET /api/v1/events
 * @desc    Get all events with optional filtering
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const { 
      type, 
      severity, 
      status, 
      region, 
      limit = 50, 
      page = 1 
    } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (region) filter['location.region'] = new RegExp(region as string, 'i');

    // Pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const events = await Event.find(filter)
      .limit(parseInt(limit as string))
      .skip(skip)
      .sort({ 'details.startTime': -1, severity: -1 });

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: events,
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
 * @route   GET /api/v1/events/:id
 * @desc    Get event by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return next(createError('Event not found', 404));
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/events/active
 * @desc    Get active events
 * @access  Public
 */
router.get('/active', async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    
    const activeEvents = await Event.find({ status: 'ACTIVE' })
      .limit(parseInt(limit as string))
      .sort({ severity: -1, 'details.startTime': -1 });

    res.json({
      success: true,
      data: activeEvents,
      count: activeEvents.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/events/region/:region
 * @desc    Get events by region
 * @access  Public
 */
router.get('/region/:region', async (req, res, next) => {
  try {
    const { limit = 20, status } = req.query;
    
    const filter: any = {
      'location.region': new RegExp(req.params.region, 'i')
    };
    
    if (status) filter.status = status;
    
    const events = await Event.find(filter)
      .limit(parseInt(limit as string))
      .sort({ 'details.startTime': -1, severity: -1 });

    res.json({
      success: true,
      data: events,
      region: req.params.region,
      count: events.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/events/type/:type
 * @desc    Get events by type
 * @access  Public
 */
router.get('/type/:type', async (req, res, next) => {
  try {
    const { limit = 20, severity } = req.query;
    const eventType = req.params.type.toUpperCase();
    
    if (!['FLOOD', 'AVALANCHE', 'GLACIER_RETREAT', 'LAKE_FORMATION', 'WEATHER_ALERT', 'SYSTEM_ALERT'].includes(eventType)) {
      return next(createError('Invalid event type', 400));
    }

    const filter: any = { type: eventType };
    
    if (severity) filter.severity = severity;
    
    const events = await Event.find(filter)
      .limit(parseInt(limit as string))
      .sort({ 'details.startTime': -1, severity: -1 });

    res.json({
      success: true,
      data: events,
      type: eventType,
      count: events.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/events
 * @desc    Create new event
 * @access  Private
 */
router.post('/', async (req, res, next) => {
  try {
    const event = new Event(req.body);
    await event.save();

    // If this is a critical event, send emergency alerts
    if (event.severity === 'CRITICAL' || event.severity === 'HIGH') {
      await sendEmergencyAlerts(event);
    }

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/v1/events/:id
 * @desc    Update event
 * @access  Private
 */
router.put('/:id', async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return next(createError('Event not found', 404));
    }

    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/v1/events/:id
 * @desc    Delete event
 * @access  Private
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return next(createError('Event not found', 404));
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/events/:id/resolve
 * @desc    Resolve an active event
 * @access  Private
 */
router.post('/:id/resolve', async (req, res, next) => {
  try {
    const { resolution, endTime } = req.body;
    
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        status: 'RESOLVED',
        'details.endTime': endTime || new Date(),
        resolution: resolution || 'Event resolved by administrator'
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return next(createError('Event not found', 404));
    }

    res.json({
      success: true,
      data: event,
      message: 'Event resolved successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/events/stats/overview
 * @desc    Get event statistics overview
 * @access  Public
 */
router.get('/stats/overview', async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ status: 'ACTIVE' });
    
    const typeStats = await Event.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const severityStats = await Event.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    const regionStats = await Event.aggregate([
      {
        $group: {
          _id: '$location.region',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        total: totalEvents,
        active: activeEvents,
        typeDistribution: typeStats,
        severityDistribution: severityStats,
        topRegions: regionStats
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/events/:id/notify
 * @desc    Send notifications for an event
 * @access  Private
 */
router.post('/:id/notify', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return next(createError('Event not found', 404));
    }

    // Find subscribers who should be notified
    const subscribers = await Notification.find({
      status: 'ACTIVE',
      'preferences.riskLevels': event.severity,
      $or: [
        { 'subscriptions.globalAlerts': true },
        { 'subscriptions.regions': event.location.region }
      ]
    });

    if (subscribers.length === 0) {
      return res.json({
        success: true,
        message: 'No subscribers to notify for this event',
        count: 0
      });
    }

    // Send emergency alerts
    const alertResult = await NotificationService.sendEmergencyAlert({
      event,
      subscribers,
      message: 'Please take necessary precautions and follow local emergency guidelines.'
    });

    // Update event notification count
    await Event.findByIdAndUpdate(req.params.id, {
      'notifications.sent': alertResult.success,
      'notifications.total': subscribers.length,
      'notifications.lastSent': new Date()
    });

    res.json({
      success: true,
      data: alertResult,
      message: `Emergency alerts sent to ${alertResult.success}/${subscribers.length} subscribers`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Helper function to send emergency alerts for new events
 */
async function sendEmergencyAlerts(event: any): Promise<void> {
  try {
    // Find subscribers who should be notified
    const subscribers = await Notification.find({
      status: 'ACTIVE',
      'preferences.riskLevels': event.severity,
      $or: [
        { 'subscriptions.globalAlerts': true },
        { 'subscriptions.regions': event.location.region }
      ]
    });

    if (subscribers.length > 0) {
      await NotificationService.sendEmergencyAlert({
        event,
        subscribers,
        message: 'New event detected. Please take necessary precautions.'
      });
    }
  } catch (error) {
    console.error('❌ Error sending emergency alerts:', error);
  }
}

export default router;
