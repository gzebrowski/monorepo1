# Simple Blog Application

# Simple Blog - Dokumentacja Shared Library

## 📋 Przegląd projektu

Simple Blog to kompletna aplikacja demonstrująca użycie **shared library** w architekturze monorepo. Projekt pokazuje jak efektywnie dzielić typy, walidację i definicje API między backend (NestJS) i frontend (React).

## 🏗️ Architektura

```
simpleblog/
├── apps/
│   ├── backend/          # NestJS API Server
│   │   ├── src/
│   │   │   ├── auth/     # Moduł uwierzytelniania
│   │   │   ├── users/    # Zarządzanie użytkownikami  
│   │   │   ├── posts/    # Zarządzanie postami
│   │   │   ├── categories/ # Zarządzanie kategoriami
│   │   │   └── prisma/   # Konfiguracja bazy danych
│   │   └── package.json
│   └── frontend/         # React Client App
│       ├── src/
│       │   ├── components/ # Komponenty React z shared types
│       │   ├── api/      # API client używający shared library
│       │   └── pages/    # Strony aplikacji
│       └── package.json
└── libs/
    └── shared/           # 🔗 Shared Library
        ├── src/
        │   ├── types/    # Wspólne typy TypeScript
        │   ├── validation/ # Schematy Zod
        │   └── api/      # Definicje API
        └── package.json
```

## 🔗 Shared Library - Kluczowe funkcje

### 1. **Wspólne typy** (`libs/shared/src/types/`)
```typescript
// Przykład: wspólne typy dla User
export interface User extends BaseEntity {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive: boolean;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
```

### 2. **Walidacja Zod** (`libs/shared/src/validation/`)
```typescript
// Przykład: shared validation schema
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3).max(20),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// Automatyczne generowanie typów z schematów
export type CreateUserInput = z.infer<typeof createUserSchema>;
```

### 3. **Definicje API** (`libs/shared/src/api/`)
```typescript
// Przykład: wspólne definicje API
export interface AuthApi {
  login(data: LoginRequest): Promise<AuthResponse>;
  register(data: RegisterRequest): Promise<AuthResponse>;
  getProfile(): Promise<User>;
}
```

## 🚀 Przykłady użycia

### Backend (NestJS)
```typescript
// apps/backend/src/auth/dto/create-user.dto.ts
import { createUserSchema, type CreateUserRequest } from '@simpleblog/shared';

export class CreateUserDto implements CreateUserRequest {
  @IsEmail()
  email: string;

  @Length(3, 20)
  username: string;

  @MinLength(6)
  password: string;

  // Walidacja zgodna ze shared schema
  validate() {
    return createUserSchema.parse(this);
  }
}
```

### Frontend (React)
```typescript
// apps/frontend/src/components/auth/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginRequest } from '@simpleblog/shared';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema), // 🔥 Używamy shared validation!
  });

  const onSubmit = async (data: LoginRequest) => {
    const response = await apiClient.login(data); // 🔥 Używamy shared types!
    // ...
  };
  
  // ...
};
```

### API Client
```typescript
// apps/frontend/src/api/client.ts
import { loginSchema, type LoginRequest, type AuthResponse } from '@simpleblog/shared';

class ApiClient {
  async login(data: LoginRequest): Promise<ClientResponse<AuthResponse>> {
    const validatedData = loginSchema.parse(data); // 🔥 Walidacja po stronie klienta!
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });
  }
}
```

## 💡 Korzyści shared library

### 1. **Spójność typów**
- ✅ Backend i frontend używają identycznych typów
- ✅ Automatyczne wykrywanie błędów kompilacji przy zmianach API
- ✅ IntelliSense i autocompletowanie w całym projekcie

### 2. **Centralna walidacja**
- ✅ Jedna definicja reguł walidacji dla backend i frontend
- ✅ Zod schematy generują automatycznie typy TypeScript
- ✅ Eliminacja duplikacji logiki walidacyjnej

### 3. **Bezpieczeństwo typów**
- ✅ Compile-time sprawdzanie zgodności API
- ✅ Automatyczne refaktorowanie przy zmianach typów
- ✅ Brak rozbieżności między kontraktem API a implementacją

### 4. **Łatwość utrzymania**
- ✅ Zmiana typu w jednym miejscu propaguje się automatycznie
- ✅ Wersjonowanie shared library
- ✅ Jasny podział odpowiedzialności

## 🛠️ Stack technologiczny

### Backend
- **NestJS** v10.0.0 - Framework Node.js
- **PostgreSQL** - Baza danych
- **Prisma** v5.22.0 - ORM
- **JWT** - Uwierzytelnianie
- **Swagger** - Dokumentacja API

### Frontend  
- **React** v18.2.0 - UI Framework
- **TypeScript** - Statyczne typowanie
- **Vite** - Build tool
- **Tailwind CSS** - Stylowanie
- **shadcn/ui** - Komponenty UI
- **React Hook Form** + **Zod** - Formularze i walidacja

### Shared Library
- **TypeScript** - Wspólne typy
- **Zod** v3.22.0 - Schema validation
- **Wspólne definicje API**

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

Run backend: cd apps/backend && npm run start:dev