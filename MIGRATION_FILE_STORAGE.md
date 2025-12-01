# Migration Guide: Backend File Upload to @prisma-admin/node-utils

This guide shows how to migrate from the local `file-upload.helper.ts` to the new `@prisma-admin/node-utils` package.

## Step 1: Add Package to Backend Dependencies

First, add the node-utils package to your backend's webpack configuration (already done):

```javascript
// apps/backend/webpack.config.js
resolve: {
  alias: {
    '@prisma-admin/core': path.resolve(__dirname, '../../prisma-admin/packages/core/dist'),
    '@prisma-admin/nestjs': path.resolve(__dirname, '../../prisma-admin/packages/nestjs/dist'),
    '@prisma-admin/node-utils': path.resolve(__dirname, '../../prisma-admin/packages/node-utils/dist'),
  },
}
```

And update tsconfig.json:

```json
{
  "compilerOptions": {
    "paths": {
      "@prisma-admin/core": ["../../prisma-admin/packages/core/dist"],
      "@prisma-admin/nestjs": ["../../prisma-admin/packages/nestjs/dist"],
      "@prisma-admin/node-utils": ["../../prisma-admin/packages/node-utils/dist"]
    }
  }
}
```

## Step 2: Update File Upload Service

### Before (using local helper):

```typescript
// apps/backend/src/common/utils/file-upload.helper.ts
import { FileUploadHelper } from './file-upload.helper';

const fileHelper = new FileUploadHelper('./uploads', 'http://localhost:3001');
```

### After (using @prisma-admin/node-utils):

```typescript
// apps/backend/src/common/services/file-storage.service.ts
import { Injectable } from '@nestjs/common';
import { LocalFileStorage } from '@prisma-admin/node-utils';

@Injectable()
export class FileStorageService {
  private storage: LocalFileStorage;

  constructor() {
    this.storage = new LocalFileStorage(
      process.env.UPLOAD_DIR || './uploads',
      process.env.NX_PUBLIC_API_URL || 'http://localhost:3001'
    );
  }

  async onModuleInit() {
    await this.storage.initialize();
  }

  async processFile(file: Express.Multer.File, extraPath?: string) {
    return await this.storage.processFile(file, extraPath);
  }

  getFileUrl(fileKey: string | null): string | null {
    return this.storage.getFileUrl(fileKey);
  }

  async deleteFile(fileKey: string) {
    await this.storage.deleteFile(fileKey);
  }

  // New feature: Thumbnail support
  async createThumbnail(fileKey: string, maxWidth = 300, maxHeight = 300) {
    return await this.storage.createThumbnail(fileKey, undefined, maxWidth, maxHeight, {
      format: 'jpeg',
      quality: 80
    });
  }

  getThumbnailUrl(fileKey: string | null, maxWidth = 300, maxHeight = 300): string | null {
    return this.storage.getThumbnailUrl(fileKey, maxWidth, maxHeight);
  }
}
```

## Step 3: Update Module

```typescript
// apps/backend/src/common/common.module.ts
import { Module } from '@nestjs/common';
import { FileStorageService } from './services/file-storage.service';

@Module({
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class CommonModule {}
```

## Step 4: Update Controllers/Services Using File Upload

### Before:

```typescript
import { FileUploadHelper } from '../common/utils/file-upload.helper';

export class PostsService {
  private fileHelper = new FileUploadHelper('./uploads', process.env.NX_PUBLIC_API_URL);

  async createPost(data: CreatePostDto, file?: Express.Multer.File) {
    let featuredImage = null;
    
    if (file) {
      const fileKey = await this.fileHelper.processFile(file, 'posts');
      featuredImage = this.fileHelper.getFileUrl(fileKey);
    }

    return await this.prisma.post.create({
      data: {
        ...data,
        featuredImage,
      },
    });
  }
}
```

### After:

```typescript
import { Injectable } from '@nestjs/common';
import { FileStorageService } from '../common/services/file-storage.service';

@Injectable()
export class PostsService {
  constructor(private readonly fileStorage: FileStorageService) {}

  async createPost(data: CreatePostDto, file?: Express.Multer.File) {
    let featuredImage = null;
    let featuredImageThumbnail = null;
    
    if (file) {
      const fileKey = await this.fileStorage.processFile(file, 'posts');
      featuredImage = this.fileStorage.getFileUrl(fileKey);
      
      // NEW: Generate thumbnail for better performance
      const thumbnailKey = await this.fileStorage.createThumbnail(fileKey);
      featuredImageThumbnail = this.fileStorage.getFileUrl(thumbnailKey);
    }

    return await this.prisma.post.create({
      data: {
        ...data,
        featuredImage,
        featuredImageThumbnail, // Add this field to your schema
      },
    });
  }

  async deletePost(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    
    if (post?.featuredImage) {
      // Extract file key from URL
      const fileKey = post.featuredImage.split('/uploads/')[1];
      await this.fileStorage.deleteFile(fileKey);
    }

    return await this.prisma.post.delete({ where: { id } });
  }
}
```

## Step 5: Add Thumbnail Field to Schema (Optional)

```prisma
// prisma/schema.prisma
model Post {
  id                     Int       @id @default(autoincrement())
  title                  String
  content                String
  featuredImage          String?
  featuredImageThumbnail String?   // NEW field for thumbnail
  // ... other fields
}
```

Then run migration:

```bash
npx prisma migrate dev --name add_post_thumbnail
```

## Step 6: Update Frontend to Use Thumbnails (Optional)

```tsx
// In your React component
interface Post {
  id: number;
  title: string;
  featuredImage?: string;
  featuredImageThumbnail?: string;
}

function PostCard({ post }: { post: Post }) {
  return (
    <div>
      <h2>{post.title}</h2>
      {/* Use thumbnail for list view, full image for detail */}
      <img 
        src={post.featuredImageThumbnail || post.featuredImage} 
        alt={post.title}
        loading="lazy"
      />
    </div>
  );
}
```

## Switching to S3 Storage (Advanced)

To switch from local storage to S3:

1. Install AWS SDK:
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

2. Update FileStorageService:
```typescript
import { Injectable } from '@nestjs/common';
import { S3FileStorage } from '@prisma-admin/node-utils/s3-storage';

@Injectable()
export class FileStorageService {
  private storage: S3FileStorage;

  constructor() {
    this.storage = new S3FileStorage(
      {
        region: process.env.AWS_REGION || 'us-east-1',
        bucket: process.env.AWS_S3_BUCKET,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      process.env.AWS_CLOUDFRONT_URL || process.env.AWS_S3_PUBLIC_URL,
    );
  }

  // Rest of the implementation stays the same!
  // This is the power of abstraction - same interface for different backends
}
```

3. Add environment variables:
```env
AWS_REGION=us-east-1
AWS_S3_BUCKET=my-blog-uploads
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_CLOUDFRONT_URL=https://d1234567890.cloudfront.net
```

## Benefits of Migration

✅ **Shared Code**: Reusable across multiple projects  
✅ **Better Abstraction**: Unified interface for different storage backends  
✅ **New Features**: Built-in thumbnail generation  
✅ **Type Safety**: Full TypeScript support  
✅ **Easy Migration**: Minimal code changes required  
✅ **Scalability**: Switch between local/S3 storage without changing business logic  
✅ **Testing**: Easier to mock storage in unit tests  

## Cleanup

After successful migration, you can remove:
- `apps/backend/src/common/utils/file-upload.helper.ts`

Keep the webpack alias and tsconfig paths for continued access to the package.
