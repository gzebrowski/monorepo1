# Simple Blog Application

A scalable blog application built with modern technologies in a monorepo architecture.

## 🚀 Tech Stack

- **Backend**: NestJS with TypeScript
- **Frontend**: ReactJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Architecture**: Monorepo structure

## ✨ Features

- 👤 User Authentication (Registration, Login, Password Change)
- 📝 Blog Post Management
- 🏷️ Category System
- 🎨 Modern UI/UX
- 🔒 Security Best Practices
- 📊 Scalable Architecture

## 📁 Project Structure

```
simpleblog/
├── apps/
│   ├── backend/          # NestJS API server
│   └── frontend/         # React client app
├── packages/             # Shared packages
└── .github/             # GitHub configurations
```

## 🛠️ Development Setup

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL
- npm >= 9.0.0

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Setup environment variables:
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

4. Setup database:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Start development servers:
   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm run dev` - Start both backend and frontend in development mode
- `npm run build` - Build both applications for production
- `npm run test` - Run tests for both applications
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with initial data

## 🌐 URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api

## 📝 License

This project is licensed under the MIT License.