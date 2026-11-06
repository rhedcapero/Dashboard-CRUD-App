const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { supabase, isConfigured } = require('../supabase');

const ADMINS_FILE = path.resolve(__dirname, '..', 'data', 'admins.json');

// In-memory active sessions store: token -> { user, expiresAt, rememberMe }
const activeSessions = new Map();

// Helper to load admins from JSON
function loadAdmins() {
  try {
    if (fs.existsSync(ADMINS_FILE)) {
      const content = fs.readFileSync(ADMINS_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading admins file:', err.message);
  }
  return [];
}

// Clean up expired sessions periodically (every 15 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt && session.expiresAt < now) {
      activeSessions.delete(token);
    }
  }
}, 15 * 60 * 1000);

/**
 * Authenticate Administrator
 * Checks Supabase Auth, Supabase DB table, and secure local admin store
 */
async function authenticateAdmin(email, password, rememberMe = false) {
  if (!email || !password) {
    return {
      success: false,
      message: 'Both email address and password are required.'
    };
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // 1. Try Supabase Auth if configured
  if (isConfigured() && supabase && supabase.auth) {
    try {
      const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: String(password)
      });

      if (!supaError && supaData && supaData.session) {
        const token = supaData.session.access_token;
        const user = {
          id: supaData.user.id,
          email: supaData.user.email,
          name: supaData.user.user_metadata?.name || 'CPSU Registrar Admin',
          role: 'CPSU Registrar',
          department: "Registrar's Office"
        };

        const ttl = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
        activeSessions.set(token, {
          user,
          expiresAt: Date.now() + ttl,
          rememberMe: Boolean(rememberMe)
        });

        return {
          success: true,
          token,
          user,
          expiresIn: ttl
        };
      }
    } catch (err) {
      // Supabase auth error - continue to check admin database
    }
  }

  // 2. Try Supabase admin_users table if available
  if (isConfigured() && supabase) {
    try {
      const { data: supaAdmins, error: dbErr } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', normalizedEmail)
        .limit(1);

      if (!dbErr && supaAdmins && supaAdmins.length > 0) {
        const admin = supaAdmins[0];
        if (admin.active !== false) {
          const computedHash = crypto.scryptSync(String(password), admin.salt, 64).toString('hex');
          if (crypto.timingSafeEqual(Buffer.from(admin.password_hash || admin.passwordHash, 'hex'), Buffer.from(computedHash, 'hex'))) {
            return createAdminSession(admin, rememberMe);
          }
        }
      }
    } catch (err) {
      // Table doesn't exist or query failed, fallback to local store
    }
  }

  // 3. Check secure local admin store
  const localAdmins = loadAdmins();
  const matchedAdmin = localAdmins.find(
    a => a.email.toLowerCase() === normalizedEmail && a.active !== false
  );

  if (matchedAdmin) {
    try {
      const computedHash = crypto.scryptSync(String(password), matchedAdmin.salt, 64).toString('hex');
      const storedBuf = Buffer.from(matchedAdmin.passwordHash, 'hex');
      const computedBuf = Buffer.from(computedHash, 'hex');

      if (storedBuf.length === computedBuf.length && crypto.timingSafeEqual(storedBuf, computedBuf)) {
        return createAdminSession(matchedAdmin, rememberMe);
      }
    } catch (err) {
      console.error('Password hash comparison error:', err);
    }
  }

  // If no match found or password mismatch
  return {
    success: false,
    message: 'Invalid administrator email address or password. Access denied.'
  };
}

/**
 * Helper to generate session token and store session
 */
function createAdminSession(admin, rememberMe) {
  const token = 'cpsu_adm_' + crypto.randomBytes(32).toString('hex');
  const ttl = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const user = {
    id: admin.id,
    name: admin.name || 'Faculty Staff',
    email: admin.email,
    role: admin.role || 'CPSU Registrar',
    department: admin.department || "Registrar's Office"
  };

  activeSessions.set(token, {
    user,
    expiresAt: Date.now() + ttl,
    rememberMe: Boolean(rememberMe)
  });

  return {
    success: true,
    token,
    user,
    expiresIn: ttl
  };
}

/**
 * Verify Session Token
 */
async function verifySessionToken(token) {
  if (!token) return { valid: false };

  // 1. Check in-memory active sessions
  const session = activeSessions.get(token);
  if (session) {
    if (session.expiresAt && session.expiresAt < Date.now()) {
      activeSessions.delete(token);
      return { valid: false, message: 'Session expired. Please log in again.' };
    }
    return { valid: true, user: session.user };
  }

  // 2. Check with Supabase Auth if token looks like a Supabase JWT
  if (isConfigured() && supabase && token.includes('.')) {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data && data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || 'CPSU Registrar Admin',
          role: 'CPSU Registrar'
        };
        return { valid: true, user };
      }
    } catch (err) {
      // Not a valid Supabase token
    }
  }

  return { valid: false, message: 'Invalid or unauthorized session token.' };
}

/**
 * Invalidate Session (Logout)
 */
async function invalidateSession(token) {
  if (token) {
    activeSessions.delete(token);
    if (isConfigured() && supabase && token.includes('.')) {
      try {
        await supabase.auth.signOut();
      } catch (err) {}
    }
  }
  return { success: true };
}

module.exports = {
  authenticateAdmin,
  verifySessionToken,
  invalidateSession
};

