# Environment Variables Configuration

## Overview

This monorepo uses centralized environment variable configuration with support for both backend and frontend applications. Environment variables are defined in the root `.env` file and can be accessed by all applications.

## File Structure

```
simpleblog/
├── .env                    # Main environment file (not in git)
├── .env.example           # Template with all variables
├── apps/
│   ├── backend/           # Backend no longer has its own .env
│   └── frontend/          # Frontend no longer has its own .env
└── libs/shared/src/config/
    └── env.ts             # Type-safe configuration
```

## Environment Variable Prefixes

### NX_PUBLIC_* Variables
Variables with `NX_PUBLIC_` prefix are available in both backend and frontend:
- `NX_PUBLIC_API_URL` - API base URL
- `NX_PUBLIC_APP_NAME` - Application name
- `NX_PUBLIC_NODE_ENV` - Environment (development/production)
- `NX_PUBLIC_ENABLE_*` - Feature flags

### Backend-Only Variables
Variables without prefix are only available in backend:
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port

## Usage Examples

### Backend (NestJS)
```typescript
import { serverConfig, publicConfig } from '@simpleblog/shared';

// Backend-specific config
const port = serverConfig.port;
const dbUrl = serverConfig.databaseUrl;

// Public config (also available in frontend)
const apiUrl = publicConfig.apiUrl;
const appName = publicConfig.appName;
```

### Frontend (React)
```typescript
import { publicConfig, apiUrl } from '@simpleblog/shared';

// Only NX_PUBLIC_* variables are available
const apiBaseUrl = publicConfig.apiUrl;
const appName = publicConfig.appName;

// Helper functions
const fullApiUrl = apiUrl('/posts'); // http://localhost:3001/posts
```

## Configuration

### Development Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Modify variables in `.env` as needed:
   ```bash
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
   
   # API URL (accessible in frontend)
   NX_PUBLIC_API_URL="http://localhost:3001"
   ```

### Production Setup
1. Set environment variables in your deployment platform
2. Ensure all `NX_PUBLIC_*` variables are set for frontend build
3. Update production URLs:
   ```bash
   NX_PUBLIC_API_URL="https://api.yourdomain.com"
   NX_PUBLIC_FRONTEND_URL="https://yourdomain.com"
   ```

## Available Variables

### Database Configuration
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/simpleblog"
```

### JWT Configuration
```bash
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRATION="7d"
```

### Server Configuration
```bash
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

### Public Configuration (Available in Frontend)
```bash
# API Configuration
NX_PUBLIC_API_URL="http://localhost:3001"
NX_PUBLIC_API_VERSION="v1"

# App Configuration
NX_PUBLIC_APP_NAME="SimpleBlog"
NX_PUBLIC_APP_VERSION="1.0.0"
NX_PUBLIC_FRONTEND_URL="http://localhost:3000"
NX_PUBLIC_NODE_ENV="development"

# Feature Flags
NX_PUBLIC_ENABLE_REGISTRATION="true"
NX_PUBLIC_ENABLE_COMMENTS="true"
NX_PUBLIC_ENABLE_ANALYTICS="false"
```

### Development Tools
```bash
ENABLE_SWAGGER="true"
LOG_LEVEL="debug"
DB_LOGGING="true"
DB_SYNC="false"
```

## Type Safety

The configuration is fully type-safe with TypeScript:

```typescript
import { config, serverConfig, publicConfig, apiUrl } from '@simpleblog/shared';

// All properties are typed
const port: number = serverConfig.port;
const isDevMode: boolean = config.public.nodeEnv === 'development';

// Helper functions with proper types
const postsUrl: string = apiUrl('/posts');
```

## Environment Validation

The configuration automatically validates and provides defaults:
- Missing variables get sensible defaults
- Invalid values are converted to proper types
- Helper functions for environment detection

## Best Practices

### Security
- Never commit `.env` file to git
- Keep sensitive variables (JWT_SECRET, DATABASE_URL) backend-only
- Use different secrets for different environments

### Organization
- Group related variables together
- Use descriptive names with consistent prefixes
- Document all variables in `.env.example`

### Frontend Variables
- Always prefix with `NX_PUBLIC_` for frontend access
- Don't include sensitive data in public variables
- Use feature flags for conditional functionality

### Environment Detection
```typescript
import { isDevelopment, isProduction } from '@simpleblog/shared';

if (isDevelopment()) {
  console.log('Development mode');
}

if (isProduction()) {
  // Production-specific code
}
```

## Troubleshooting

### Frontend Can't Access Variables
- Ensure variable has `NX_PUBLIC_` prefix
- Rebuild frontend after changing variables
- Check that shared library is compiled

### Backend Can't Access Variables
- Verify `.env` file is in project root
- Check variable name spelling
- Ensure shared library is compiled and imported

### Build Issues
- Compile shared library first: `npm run build` in `libs/shared`
- Clear build cache if needed
- Check import paths in applications