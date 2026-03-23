// Helper function to normalize API URLs (remove trailing slashes)
const normalizeApiUrl = (url: string): string => {
  return url.replace(/\/$/, ''); // Remove trailing slash if present
};

// Application configuration
export const config = {
  API_BASE_URL: normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'),
  APP_NAME: 'Student Admin Portal',
  VERSION: '1.0.0',
}

// Development fallbacks
export const devConfig = {
  API_BASE_URL: normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'),
}

// Production configuration
export const prodConfig = {
  API_BASE_URL: normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.onrender.com'),
}
