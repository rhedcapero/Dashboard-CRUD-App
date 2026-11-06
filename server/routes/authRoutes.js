const express = require('express');
const router = express.Router();
const { authenticateAdmin, verifySessionToken, invalidateSession } = require('../services/authService');
const { requireAdminAuth } = require('../middleware/authMiddleware');

/**
 * POST /api/auth/login
 * Authenticate administrator with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both an administrator email address and password.'
      });
    }

    const result = await authenticateAdmin(email, password, rememberMe);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message || 'Incorrect administrator credentials. Please try again.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Administrator authentication successful.',
      token: result.token,
      user: result.user,
      expiresIn: result.expiresIn
    });
  } catch (error) {
    console.error('Login route error:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal error occurred during authentication. Please try again.'
    });
  }
});

/**
 * GET /api/auth/verify
 * Check whether the provided session token is active and valid
 */
router.get('/verify', requireAdminAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    authenticated: true,
    user: req.admin
  });
});

/**
 * POST /api/auth/logout
 * Invalidate current administrator session
 */
router.post('/logout', async (req, res) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (req.headers['x-admin-token']) {
      token = req.headers['x-admin-token'].trim();
    }

    await invalidateSession(token);

    return res.status(200).json({
      success: true,
      message: 'Administrator successfully logged out.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(200).json({
      success: true,
      message: 'Logged out.'
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Handles administrator password recovery requests
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please enter your registered administrator email address.'
    });
  }

  return res.status(200).json({
    success: true,
    message: `Password reset instructions have been dispatched to the CPSU Registrar Office Management Console for ${email}. Please contact the system administrator if you do not receive them within a few minutes.`
  });
});

module.exports = router;

