const { verifySessionToken } = require('../services/authService');

/**
 * Authentication Middleware for Admin Protection
 * Verifies that the incoming request has a valid Bearer token.
 */
async function requireAdminAuth(req, res, next) {
  let token = null;

  // Extract from Authorization header (Bearer <token>)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-admin-token']) {
    token = req.headers['x-admin-token'].trim();
  } else if (req.query && req.query.auth_token) {
    token = req.query.auth_token.trim();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      message: 'Unauthorized. Please log in as an administrator to access this system.'
    });
  }

  const result = await verifySessionToken(token);
  if (!result.valid) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      message: result.message || 'Session expired or invalid. Please log in again.'
    });
  }

  // Attach authenticated admin user to request object
  req.admin = result.user;
  next();
}

module.exports = {
  requireAdminAuth
};

