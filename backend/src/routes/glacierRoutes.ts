import express from 'express';
import Glacier from '../models/Glacier';
import DataService from '../services/dataService';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

/**
 * @route   GET /api/v1/glaciers
 * @desc    Get all glaciers with optional filtering
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const { 
      region, 
      country, 
      riskLevel, 
      status, 
      limit = 50, 
      page = 1 
    } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (region) filter['location.region'] = new RegExp(region as string, 'i');
    if (country) filter['location.country'] = new RegExp(country as string, 'i');
    if (riskLevel) filter['riskAssessment.glofRisk'] = riskLevel;
    if (status) filter.status = status;

    // Pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const glaciers = await Glacier.find(filter)
      .limit(parseInt(limit as string))
      .skip(skip)
      .sort({ 'riskAssessment.glofRisk': -1, createdAt: -1 });

    const total = await Glacier.countDocuments(filter);

    res.json({
      success: true,
      data: glaciers,
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
 * @route   GET /api/v1/glaciers/:id
 * @desc    Get glacier by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const glacier = await Glacier.findById(req.params.id);
    
    if (!glacier) {
      return next(createError('Glacier not found', 404));
    }

    res.json({
      success: true,
      data: glacier
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/glaciers/:id/data
 * @desc    Get glacier with real-time data
 * @access  Public
 */
router.get('/:id/data', async (req, res, next) => {
  try {
    const glacier = await Glacier.findById(req.params.id);
    
    if (!glacier) {
      return next(createError('Glacier not found', 404));
    }

    // Fetch real-time data
    const realTimeData = await DataService.processExternalData(glacier);

    res.json({
      success: true,
      data: {
        glacier,
        realTimeData
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/glaciers/:id/history
 * @desc    Get glacier historical data
 * @access  Public
 */
router.get('/:id/history', async (req, res, next) => {
  try {
    const { years = 10 } = req.query;
    
    const glacier = await Glacier.findById(req.params.id);
    
    if (!glacier) {
      return next(createError('Glacier not found', 404));
    }

    // Fetch historical data
    const historicalData = await DataService.fetchHistoricalData(
      req.params.id, 
      parseInt(years as string)
    );

    res.json({
      success: true,
      data: {
        glacier,
        historicalData
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/glaciers/region/:region
 * @desc    Get glaciers by region
 * @access  Public
 */
router.get('/region/:region', async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    
    const glaciers = await Glacier.find({
      'location.region': new RegExp(req.params.region, 'i')
    })
    .limit(parseInt(limit as string))
    .sort({ 'riskAssessment.glofRisk': -1 });

    res.json({
      success: true,
      data: glaciers,
      region: req.params.region
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/glaciers/risk/:level
 * @desc    Get glaciers by risk level
 * @access  Public
 */
router.get('/risk/:level', async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const riskLevel = req.params.level.toUpperCase();
    
    if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(riskLevel)) {
      return next(createError('Invalid risk level', 400));
    }

    const glaciers = await Glacier.find({
      'riskAssessment.glofRisk': riskLevel
    })
    .limit(parseInt(limit as string))
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: glaciers,
      riskLevel
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/glaciers/stats/overview
 * @desc    Get glacier statistics overview
 * @access  Public
 */
router.get('/stats/overview', async (req, res, next) => {
  try {
    const totalGlaciers = await Glacier.countDocuments();
    const activeGlaciers = await Glacier.countDocuments({ status: 'ACTIVE' });
    
    const riskStats = await Glacier.aggregate([
      {
        $group: {
          _id: '$riskAssessment.glofRisk',
          count: { $sum: 1 }
        }
      }
    ]);

    const regionStats = await Glacier.aggregate([
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
        total: totalGlaciers,
        active: activeGlaciers,
        riskDistribution: riskStats,
        topRegions: regionStats
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/glaciers
 * @desc    Create new glacier (Admin only in production)
 * @access  Private
 */
router.post('/', async (req, res, next) => {
  try {
    const glacier = new Glacier(req.body);
    await glacier.save();

    res.status(201).json({
      success: true,
      data: glacier,
      message: 'Glacier created successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/v1/glaciers/:id
 * @desc    Update glacier (Admin only in production)
 * @access  Private
 */
router.put('/:id', async (req, res, next) => {
  try {
    const glacier = await Glacier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!glacier) {
      return next(createError('Glacier not found', 404));
    }

    res.json({
      success: true,
      data: glacier,
      message: 'Glacier updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/v1/glaciers/:id
 * @desc    Delete glacier (Admin only in production)
 * @access  Private
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const glacier = await Glacier.findByIdAndDelete(req.params.id);

    if (!glacier) {
      return next(createError('Glacier not found', 404));
    }

    res.json({
      success: true,
      message: 'Glacier deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
