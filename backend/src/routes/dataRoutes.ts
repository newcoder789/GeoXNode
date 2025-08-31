import express from 'express';
import DataService from '../services/dataService';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

/**
 * @route   GET /api/v1/data/weather
 * @desc    Get weather data for a specific location
 * @access  Public
 */
router.get('/weather', async (req, res, next) => {
  try {
    const { lat, lon, apiKey } = req.query;

    if (!lat || !lon) {
      return next(createError('Latitude and longitude are required', 400));
    }

    const weatherData = await DataService.fetchWeatherData(
      parseFloat(lat as string),
      parseFloat(lon as string),
      apiKey as string
    );

    if (!weatherData) {
      return next(createError('Unable to fetch weather data', 500));
    }

    res.json({
      success: true,
      data: weatherData,
      source: 'OpenWeather API'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/data/satellite
 * @desc    Get satellite data from NASA
 * @access  Public
 */
router.get('/satellite', async (req, res, next) => {
  try {
    const { lat, lon, date } = req.query;

    if (!lat || !lon) {
      return next(createError('Latitude and longitude are required', 400));
    }

    const satelliteData = await DataService.fetchNASASatelliteData(
      parseFloat(lat as string),
      parseFloat(lon as string),
      date as string
    );

    if (!satelliteData) {
      return next(createError('Unable to fetch satellite data', 500));
    }

    res.json({
      success: true,
      data: satelliteData,
      source: 'NASA Earth Observatory'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/data/gee
 * @desc    Get Google Earth Engine data
 * @access  Public
 */
router.get('/gee', async (req, res, next) => {
  try {
    const { glacierId, startDate, endDate } = req.query;

    if (!glacierId || !startDate || !endDate) {
      return next(createError('Glacier ID, start date, and end date are required', 400));
    }

    const geeData = await DataService.fetchGEEData(
      glacierId as string,
      startDate as string,
      endDate as string
    );

    res.json({
      success: true,
      data: geeData,
      source: 'Google Earth Engine',
      note: 'This is mock data for development. GEE integration pending.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/data/historical
 * @desc    Get historical glacier data
 * @access  Public
 */
router.get('/historical', async (req, res, next) => {
  try {
    const { glacierId, years = 10 } = req.query;

    if (!glacierId) {
      return next(createError('Glacier ID is required', 400));
    }

    const historicalData = await DataService.fetchHistoricalData(
      glacierId as string,
      parseInt(years as string)
    );

    res.json({
      success: true,
      data: historicalData,
      source: 'GLIMS/WGMS Database',
      note: 'This is mock data for development. Database integration pending.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/data/sources
 * @desc    Get available data sources
 * @access  Public
 */
router.get('/sources', async (req, res, next) => {
  try {
    const sources = DataService.getDataSources();

    res.json({
      success: true,
      data: sources,
      total: sources.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/data/process
 * @desc    Process external data for a glacier
 * @access  Public
 */
router.post('/process', async (req, res, next) => {
  try {
    const { glacierId, glacierData } = req.body;

    if (!glacierId && !glacierData) {
      return next(createError('Glacier ID or glacier data is required', 400));
    }

    // Mock glacier data for testing
    const mockGlacier = glacierData || {
      _id: glacierId,
      location: {
        coordinates: [78.9629, 30.0668] // Example: Gangotri Glacier coordinates
      }
    };

    const processedData = await DataService.processExternalData(mockGlacier);

    res.json({
      success: true,
      data: processedData,
      message: 'Data processed successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/data/status
 * @desc    Get data service status
 * @access  Public
 */
router.get('/status', async (req, res, next) => {
  try {
    const status = {
      weather: {
        available: !!process.env.OPENWEATHER_API_KEY,
        status: process.env.OPENWEATHER_API_KEY ? 'CONNECTED' : 'NOT_CONFIGURED'
      },
      nasa: {
        available: !!process.env.NASA_API_KEY,
        status: process.env.NASA_API_KEY ? 'CONNECTED' : 'NOT_CONFIGURED'
      },
      gee: {
        available: !!process.env.GEE_CREDENTIALS_PATH,
        status: process.env.GEE_CREDENTIALS_PATH ? 'CONNECTED' : 'NOT_CONFIGURED'
      },
      timestamp: new Date(),
      uptime: process.uptime()
    };

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    next(error);
  }
});

export default router;
