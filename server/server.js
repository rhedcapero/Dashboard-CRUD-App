const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const { isConfigured, supabaseUrl } = require('./supabase');
const authRoutes = require('./routes/authRoutes');
const { requireAdminAuth } = require('./middleware/authMiddleware');
const studentRoutes = require('./routes/studentRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable Cross-Origin Resource Sharing and JSON Body Parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files from the 'public' directory
const publicDir = path.resolve(__dirname, '..', 'public');
app.use(express.static(publicDir));

// System Health & Configuration status endpoint
app.get('/api/health', (req, res) => {
  const configured = isConfigured();
  res.status(200).json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    supabase: {
      configured,
      url: configured ? supabaseUrl : 'Not configured'
    }
  });
});

// Mount API routes
app.use('/api/students', studentRoutes);
app.use('/api/dashboard', statsRoutes);

// Handle unknown API requests with a JSON 404
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route "${req.originalUrl}" not found.`
  });
});

// Fallback to index.html for any frontend SPA navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log('========================================================');
  console.log(`🚀 Student Management Dashboard Server is running!`);
  console.log(`🌐 Local URL:       http://localhost:${PORT}`);
  console.log(`📊 API Health:      http://localhost:${PORT}/api/health`);
  console.log(`👥 Students API:    http://localhost:${PORT}/api/students`);
  console.log(`📈 Stats API:       http://localhost:${PORT}/api/dashboard/stats`);
  console.log('--------------------------------------------------------');
  if (isConfigured()) {
    console.log(`✅ Supabase status: Connected (${supabaseUrl})`);
  } else {
    console.log(`⚠️  Supabase status: Not yet configured`);
    console.log(`👉 Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env`);
  }
  console.log('========================================================');
});

module.exports = app;
