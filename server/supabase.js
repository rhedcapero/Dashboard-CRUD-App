const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load .env from server directory first, fallback to root directory
const serverEnvPath = path.resolve(__dirname, '.env');
const rootEnvPath = path.resolve(__dirname, '..', '.env');

dotenv.config({ path: serverEnvPath });
dotenv.config({ path: rootEnvPath });

const supabaseUrl = process.env.SUPABASE_URL;
// Accept either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY or SUPABASE_ANON_KEY
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

const isPlaceholder = (val) => {
  if (!val) return true;
  const lower = val.toLowerCase();
  return (
    lower.includes('your-project-id') ||
    lower.includes('your-project-ref') ||
    lower.includes('your_project_url') ||
    lower.includes('paste_your_') ||
    lower.includes('your-supabase-service-role') ||
    lower.includes('your_secret_key') ||
    lower.includes('placeholder')
  );
};

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !isPlaceholder(supabaseUrl) &&
  !isPlaceholder(supabaseKey)
);

let supabase = null;

if (isConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log('✅ Supabase client successfully initialized with provided credentials.');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error.message);
  }
} else {
  console.warn('⚠️  Supabase credentials not configured or still using default placeholders.');
  console.warn('👉 Please update server/.env with your valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}

module.exports = {
  supabase,
  isConfigured: () => Boolean(supabase && isConfigured),
  supabaseUrl
};
