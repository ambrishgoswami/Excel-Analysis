// Configuration utility for environment variables
export const config = {
  // Application base URL (for routing)
  appBaseUrl: import.meta.env.VITE_APP_BASE_URL || '/',
  
  // API base URL (for API calls)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // App name
  appName: import.meta.env.VITE_APP_NAME || 'React Dashboard',
  
  // Version
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${config.apiBaseUrl}/${endpoint}`.replace(/\/+/g, '/');
};

// Helper function to get full app URL
export const getAppUrl = (path) => {
  return `${config.appBaseUrl}/${path}`.replace(/\/+/g, '/');
};

export default config; 