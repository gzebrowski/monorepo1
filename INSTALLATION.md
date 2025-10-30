# Simple Blog - Installation and Setup Guide

Due to environment limitations, the project structure has been created. To complete the setup:

## Manual Installation Steps

### 1. Backend Setup
```bash
cd apps/backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 2. Frontend Setup  
```bash
cd apps/frontend
npm install
```

### 3. Root Setup
```bash
npm install
```

## Environment Setup

1. Copy `apps/backend/.env.example` to `apps/backend/.env`
2. Update database connection string in `.env`
3. Ensure PostgreSQL is running

## Running the Application

```bash
# Start both backend and frontend
npm run dev

# Or run separately:
npm run dev:backend  # Backend on port 3001
npm run dev:frontend # Frontend on port 3000
```

## Database Commands

```bash
npm run db:migrate   # Run migrations
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database
```

## Project Features ✨

- **Backend (NestJS)**:
  - User authentication (JWT)
  - Blog posts CRUD
  - Categories management
  - Swagger API documentation
  - Prisma ORM with PostgreSQL

- **Frontend (React + TypeScript)**:
  - Modern UI with Tailwind CSS
  - Authentication flow
  - Blog post listing and reading
  - Category filtering
  - Admin dashboard

The application follows best practices including:
- TypeScript strict mode
- Input validation
- Security middleware
- Clean architecture
- Responsive design