# File Upload System - Admin Panel

System obsługi przesyłania plików dla panelu administracyjnego SimpleBlog.

## Konfiguracja

### Zmienne środowiskowe (.env)

```env
# Katalog dla przesłanych plików (względny do głównego katalogu projektu)
UPLOAD_DIR="uploads"

# Maksymalny rozmiar pliku w bajtach (10MB)
MAX_FILE_SIZE=10485760
```

### Struktura katalogów

```
/home/gz/projects/simpleblog/
├── uploads/                    # Główny katalog dla plików
│   ├── .gitkeep               # Pusty plik dla git
│   ├── users/                 # Pliki dla modelu User
│   │   └── bardzo-piekny-obrazek-1234567890.jpg
│   ├── posts/                 # Pliki dla modelu Post
│   │   └── header-image-1234567890.png
│   └── categories/            # Pliki dla modelu Category
│       └── icon-1234567890.svg
```

## Jak działa system

### 1. Przesyłanie pliku (processFile)

Gdy użytkownik w panelu admina przesyła plik:

```typescript
const fileKey = await adminService.processFile('users', file, userId);
// fileKey = "users/bardzo-piekny-obrazek-1234567890.jpg"
```

**Proces:**
1. Nazwa pliku jest slugifikowana: `"Bardzo piękny obrazek.jpg"` → `"bardzo-piekny-obrazek"`
2. Dodawany jest timestamp dla unikatowości: `"bardzo-piekny-obrazek-1234567890.jpg"`
3. Plik zapisywany jest w katalogu modelu: `uploads/users/bardzo-piekny-obrazek-1234567890.jpg`
4. Zwracana jest relatywna ścieżka (file key): `"users/bardzo-piekny-obrazek-1234567890.jpg"`

### 2. Pobieranie URL pliku (getFileUrl)

Gdy system potrzebuje wyświetlić plik:

```typescript
const url = adminService.getFileUrl(fileKey, 'users', userId);
// url = "http://localhost:3001/uploads/users/bardzo-piekny-obrazek-1234567890.jpg"
```

**Proces:**
1. Bierze file key z bazy danych
2. Generuje pełny URL do pliku
3. Zwraca URL, który może być użyty bezpośrednio w `<img>` lub do pobrania

### 3. Usuwanie pliku (deleteFile)

Opcjonalnie, możesz usunąć plik z dysku:

```typescript
await adminService.deleteFile(fileKey);
```

## Serwowanie plików statycznych

Pliki są serwowane przez NestJS jako static assets:

- **Endpoint:** `/uploads/*`
- **Przykład:** `http://localhost:3001/uploads/users/bardzo-piekny-obrazek-1234567890.jpg`

## Przykład użycia w modelu Prisma

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  avatar    String?  // Przechowuje file key: "users/avatar-1234567890.jpg"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Przykład użycia w panelu admina

### Definicja pola w admin model:

```typescript
// W pliku adminDefinitions/user.ts
export const UserAdmin = {
  model: 'User',
  fields: {
    avatar: {
      type: 'file',
      label: 'Avatar',
      accept: 'image/*',
      maxSize: 5242880, // 5MB
    }
  }
}
```

### Obsługa w komponencie React:

```typescript
// Upload pliku
const handleAvatarUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  // Panel admin automatycznie wywołuje processFile
  // i zapisuje zwrócony fileKey w polu 'avatar' w bazie danych
};

// Wyświetlanie pliku
const avatarUrl = adminService.getFileUrl(user.avatar, 'User', user.id);
<img src={avatarUrl} alt="User Avatar" />
```

## Bezpieczeństwo

### Zalecenia:

1. **Walidacja typów plików** - sprawdzaj MIME type
2. **Limit rozmiaru** - użyj MAX_FILE_SIZE
3. **Skanowanie antywirusowe** - dla produkcji
4. **Sanityzacja nazw** - już zaimplementowana przez slugify

### Możliwe rozszerzenia:

1. **Kompresja obrazów** - sharp, imagemagick
2. **Cloud storage** - AWS S3, Google Cloud Storage
3. **CDN** - CloudFlare, AWS CloudFront
4. **Thumbnails** - generowanie miniatur

## Migracja do Cloud Storage (przyszłość)

Aby zmienić na S3:

```typescript
// W file-upload.helper.ts
async processFile(file, model, id) {
  // Upload do S3
  const s3Key = await s3.upload(file, `${model}/${slugifiedName}`);
  return s3Key; // np. "s3://bucket/users/file.jpg"
}

getFileUrl(fileKey, model, idItem) {
  // Generuj signed URL
  return s3.getSignedUrl(fileKey);
}
```

## Troubleshooting

### Błąd: "ENOENT: no such file or directory"
- Upewnij się, że katalog `uploads/` istnieje
- System automatycznie tworzy podkatalogi dla modeli

### Błąd: "EACCES: permission denied"
- Sprawdź uprawnienia do katalogu `uploads/`
- `chmod 755 uploads/`

### Pliki nie są dostępne przez URL
- Sprawdź czy `app.useStaticAssets()` jest skonfigurowane w `main.ts`
- Sprawdź czy port 3001 jest otwarty

## Testy

```bash
# Test upload
curl -X POST http://localhost:3001/api/admin/items/User \
  -F "avatar=@/path/to/image.jpg"

# Test download
curl http://localhost:3001/uploads/users/image-1234567890.jpg
```
