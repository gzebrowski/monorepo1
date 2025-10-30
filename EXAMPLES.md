# 🎯 Przykłady użycia Shared Library - Simple Blog

## 📝 Szybki test funkcjonalności

### 1. **Test API w terminalu**

```bash
# Sprawdź kategorie (backend już działa na localhost:3001)
curl http://localhost:3001/categories

# Sprawdź posty
curl http://localhost:3001/posts

# Test logowania (używa shared validation)
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'
```

### 2. **Frontend - Otwórz w przeglądarce**

```
http://localhost:3000
```

**Dostępne przykłady:**
- **Strona główna**: Lista postów i kategorii z shared types
- **Logowanie**: `/login` - formularz z Zod validation 
- **Rejestracja**: `/register` - formularz z shared schemas

### 3. **Sprawdź shared validation w konsoli**

Na stronie głównej kliknij przycisk **"🔍 Test Shared Validation"** - w konsoli developera zobaczysz przykłady walidacji shared schemas.

## 🔍 Kluczowe pliki do przejrzenia

### Shared Library
```bash
# Typy wspólne dla backend/frontend
cat libs/shared/src/types/entities.ts

# Schematy walidacji Zod
cat libs/shared/src/validation/schemas.ts  

# Definicje API
cat libs/shared/src/api/types.ts
```

### Backend Integration
```bash
# DTO implementujące shared interfaces
cat apps/backend/src/auth/dto/create-user.dto.ts
cat apps/backend/src/auth/dto/login.dto.ts

# Service używający shared types
cat apps/backend/src/posts/posts.service.ts
```

### Frontend Integration  
```bash
# API client z shared types
cat apps/frontend/src/api/client.ts

# Komponenty używające shared validation
cat apps/frontend/src/components/auth/LoginForm.tsx
cat apps/frontend/src/components/auth/RegisterForm.tsx
```

## ⚡ Kluczowe demonstracje

### 1. **Type Safety w praktyce**

Spróbuj zmienić typ w `libs/shared/src/types/entities.ts`:

```typescript
// Zmień np. username z string na number
export interface User extends BaseEntity {
  username: number; // <- zmiana typu
  // ...
}
```

Następnie uruchom:
```bash
# Zobaczysz błędy kompilacji w OBUDWU aplikacjach!
cd apps/backend && npm run build
cd apps/frontend && npm run build
```

### 2. **Centralna walidacja**

W `libs/shared/src/validation/schemas.ts` zmień regułę:
```typescript
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10), // <- zwiększ wymaganie z 6 do 10
});
```

Formularz logowania automatycznie użyje nowej reguły!

### 3. **API Contract Sync**

Dodaj nowe pole w shared types:
```typescript
// libs/shared/src/types/entities.ts
export interface CreatePostRequest {
  title: string;
  slug: string;
  content: string;
  categoryId: number;
  tags?: string[]; // <- nowe pole
}
```

Backend i frontend automatycznie dostaną nowy typ!

## 🧪 Testowe dane

Backend ma seed data:
- **Admin user**: `admin@example.com` / `admin123`
- **Regular user**: `user@example.com` / `user123`  
- **3 kategorie**: Technologia, Styl życia, Podróże
- **3 przykładowe posty**

## 🚀 Development workflow

### Typowy flow przy zmianach:

1. **Zmień shared type/schema** w `libs/shared/`
2. **Zbuduj shared library**: `cd libs/shared && npm run build`  
3. **Backend automatycznie** dostaje nowe typy
4. **Frontend automatycznie** dostaje nowe typy
5. **TypeScript sprawdzi** zgodność w całym projekcie

### Dodanie nowego endpointa:

1. **Dodaj interface do shared API** (`libs/shared/src/api/types.ts`)
2. **Dodaj validation schema** (`libs/shared/src/validation/schemas.ts`)
3. **Zaimplementuj w backend** (controller + service)
4. **Dodaj do frontend API client** (`apps/frontend/src/api/client.ts`)
5. **Utwórz komponenty** używające nowego API

## 💡 Najlepsze praktyki

### ✅ DO:
- Zawsze definiuj typy w shared library PRZED implementacją
- Używaj Zod schemas jako single source of truth dla walidacji
- Buduj shared library po każdej zmianie (`npm run build`)
- Implementuj shared interfaces w DTOs (backend) i komponentach (frontend)

### ❌ DON'T:
- Nie duplikuj typów między projektami  
- Nie implementuj różnych reguł walidacji w backend/frontend
- Nie commituj bez sprawdzenia kompilacji w obu aplikacjach
- Nie używaj `any` - wykorzystuj shared types

## 🔧 Debugging

### Problem z importami shared library:
```bash
# Sprawdź czy shared library jest zbudowana
ls -la libs/shared/dist/

# Zbuduj ponownie
cd libs/shared && npm run build

# Sprawdź linki w node_modules
ls -la apps/frontend/node_modules/@simpleblog/
```

### Błędy TypeScript:
```bash
# Sprawdź typy w całym projekcie  
npx tsc --noEmit --project apps/backend/
npx tsc --noEmit --project apps/frontend/
```

## 🎉 Podsumowanie

Ten projekt pokazuje kompletny przykład shared library w monorepo TypeScript:

- 🔗 **Wspólne typy** między backend/frontend
- 🛡️ **Centralna walidacja** z Zod  
- 🚀 **Type-safe API** contracts
- 🎨 **Nowoczesny UI** z shadcn/ui
- 📝 **Praktyczne przykłady** w działającej aplikacji

To solidna podstawa do budowania większych aplikacji full-stack TypeScript!