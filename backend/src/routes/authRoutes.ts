import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../middleware/errorHandler';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Apply rate limiting to auth routes
router.use(authRateLimiter);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, role = 'USER' } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return next(createError('Email, password, and name are required', 400));
    }

    if (password.length < 6) {
      return next(createError('Password must be at least 6 characters long', 400));
    }

    // Check if user already exists
    // In a real app, you'd have a User model
    // For now, we'll just return a success message
    console.log('📝 User registration:', { email, name, role });

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user (placeholder for now)
    const user = {
      id: Date.now().toString(),
      email,
      name,
      role,
      password: hashedPassword,
      createdAt: new Date()
    };

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(createError('Email and password are required', 400));
    }

    // In a real app, you'd fetch user from database
    // For now, we'll use mock authentication
    console.log('🔐 User login attempt:', { email });

    // Mock user validation (replace with real database query)
    const mockUser = {
      id: 'mock-user-id',
      email: 'admin@glacierwatch.com',
      password: await bcrypt.hash('admin123', 12),
      name: 'Admin User',
      role: 'ADMIN'
    };

    // Check if user exists and password matches
    if (email !== mockUser.email) {
      return next(createError('Invalid credentials', 401));
    }

    const isPasswordValid = await bcrypt.compare(password, mockUser.password);
    if (!isPasswordValid) {
      return next(createError('Invalid credentials', 401));
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: mockUser.id, email: mockUser.email, role: mockUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role
        },
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return next(createError('Token is required', 400));
    }

    // Verify current token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    if (!decoded) {
      return next(createError('Invalid token', 401));
    }

    // Generate new token
    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        token: newToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(createError('Invalid token', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(createError('Token expired', 401));
    }
    next(error);
  }
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', async (req, res, next) => {
  try {
    // In a real app, you might want to blacklist the token
    // For now, we'll just return a success message
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', async (req, res, next) => {
  try {
    // Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError('Access token required', 401));
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    if (!decoded) {
      return next(createError('Invalid token', 401));
    }

    // In a real app, you'd fetch user from database
    // For now, return mock user data
    const user = {
      id: decoded.userId,
      email: decoded.email,
      name: 'Admin User',
      role: decoded.role,
      createdAt: new Date()
    };

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(createError('Invalid token', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(createError('Token expired', 401));
    }
    next(error);
  }
});

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError('Access token required', 401));
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    if (!decoded) {
      return next(createError('Invalid token', 401));
    }

    // In a real app, you'd update user in database
    // For now, return mock updated user data
    const updatedUser = {
      id: decoded.userId,
      email: email || decoded.email,
      name: name || 'Admin User',
      role: decoded.role,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      data: { user: updatedUser },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(createError('Invalid token', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(createError('Token expired', 401));
    }
    next(error);
  }
});

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(createError('Current password and new password are required', 400));
    }

    if (newPassword.length < 6) {
      return next(createError('New password must be at least 6 characters long', 400));
    }

    // Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError('Access token required', 401));
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    if (!decoded) {
      return next(createError('Invalid token', 401));
    }

    // In a real app, you'd verify current password and update
    // For now, return success message
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(createError('Invalid token', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(createError('Token expired', 401));
    }
    next(error);
  }
});

export default router;
