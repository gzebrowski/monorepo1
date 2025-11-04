/**
 * Environment Variables Configuration
 * Centralized configuration for both frontend and backend
 */

// Safe process.env access for browser compatibility
const getEnv = (key: string, defaultValue: string = '') => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

// Backend environment variables (only available in Node.js environment)
export const serverConfig = {
  port: parseInt(getEnv('PORT', '3001'), 10),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  jwtSecret: getEnv('JWT_SECRET', 'default-secret-change-in-production'),
  jwtExpiration: getEnv('JWT_EXPIRATION', '7d'),
  databaseUrl: getEnv('DATABASE_URL', ''),
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:3000'),
  enableSwagger: getEnv('ENABLE_SWAGGER') === 'true',
  logLevel: getEnv('LOG_LEVEL', 'info'),
  dbLogging: getEnv('DB_LOGGING') === 'true',
  dbSync: getEnv('DB_SYNC') === 'true',
} as const

// Public environment variables (accessible in frontend)
export const publicConfig = {
  apiUrl: getEnv('NX_PUBLIC_API_URL', 'http://localhost:3001'),
  apiVersion: getEnv('NX_PUBLIC_API_VERSION', 'v1'),
  appName: getEnv('NX_PUBLIC_APP_NAME', 'SimpleBlog'),
  appVersion: getEnv('NX_PUBLIC_APP_VERSION', '1.0.0'),
  frontendUrl: getEnv('NX_PUBLIC_FRONTEND_URL', 'http://localhost:3000'),
  nodeEnv: getEnv('NX_PUBLIC_NODE_ENV', 'development'),
  enableRegistration: getEnv('NX_PUBLIC_ENABLE_REGISTRATION') === 'true',
  enableComments: getEnv('NX_PUBLIC_ENABLE_COMMENTS') === 'true',
  enableAnalytics: getEnv('NX_PUBLIC_ENABLE_ANALYTICS') === 'true',
} as const

// Combined config for convenience
export const config = {
  ...serverConfig,
  public: publicConfig,
} as const

// Environment helpers
export const isDevelopment = () => serverConfig.nodeEnv === 'development'
export const isProduction = () => serverConfig.nodeEnv === 'production'
export const isTest = () => serverConfig.nodeEnv === 'test'

// API URL builders
export const apiUrl = (path: string = '') => {
  const baseUrl = publicConfig.apiUrl.endsWith('/') 
    ? publicConfig.apiUrl.slice(0, -1) 
    : publicConfig.apiUrl
  const apiPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${apiPath}`
}

export const apiVersionedUrl = (path: string = '') => {
  return apiUrl(`/${publicConfig.apiVersion}${path}`)
}

// Type exports for better TypeScript support
export type ServerConfig = typeof serverConfig
export type PublicConfig = typeof publicConfig
export type Config = typeof config