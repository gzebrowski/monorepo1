# Quick Start: Using @prisma-admin/node-utils in Your Project

## Installation

The package is already available in the monorepo at `prisma-admin/packages/node-utils`.

## Option 1: Using in Backend (NestJS)

### Step 1: Create File Storage Service

Create `apps/backend/src/common/services/file-storage.service.ts`:

```typescript
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

  async uploadFile(file: Express.Multer.File, path?: string) {
    const fileKey = await this.storage.processFile(file, path);
    return {
      key: fileKey,
      url: this.storage.getFileUrl(fileKey),
    };
  }

  async uploadWithThumbnail(file: Express.Multer.File, path?: string) {
    const fileKey = await this.storage.processFile(file, path);
    const thumbnailKey = await this.storage.createThumbnail(fileKey, undefined, 300, 300);
    
    return {
      key: fileKey,
      url: this.storage.getFileUrl(fileKey),
      thumbnail: {
        key: thumbnailKey,
        url: this.storage.getFileUrl(thumbnailKey),
      },
    };
  }

  async deleteFile(fileKey: string) {
    await this.storage.deleteFile(fileKey);
  }

  getFileUrl(fileKey: string | null): string | null {
    return this.storage.getFileUrl(fileKey);
  }
}
```

### Step 2: Register in Module

Update `apps/backend/src/common/common.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { FileStorageService } from './services/file-storage.service';

@Module({
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class CommonModule {}
```

### Step 3: Use in Your Service

Example in `apps/backend/src/posts/posts.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileStorageService } from '../common/services/file-storage.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorage: FileStorageService,
  ) {}

  async createPost(data: CreatePostDto, file?: Express.Multer.File) {
    let featuredImage = null;
    let featuredImageThumbnail = null;
    
    if (file) {
      const result = await this.fileStorage.uploadWithThumbnail(file, 'posts');
      featuredImage = result.url;
      featuredImageThumbnail = result.thumbnail.url;
    }

    return await this.prisma.post.create({
      data: {
        ...data,
        featuredImage,
        featuredImageThumbnail,
      },
    });
  }

  async updatePost(id: number, data: UpdatePostDto, file?: Express.Multer.File) {
    const existingPost = await this.prisma.post.findUnique({ where: { id } });
    
    // Delete old file if uploading new one
    if (file && existingPost?.featuredImage) {
      const oldFileKey = existingPost.featuredImage.split('/uploads/')[1];
      await this.fileStorage.deleteFile(oldFileKey);
    }

    let featuredImage = existingPost?.featuredImage;
    let featuredImageThumbnail = existingPost?.featuredImageThumbnail;
    
    if (file) {
      const result = await this.fileStorage.uploadWithThumbnail(file, 'posts');
      featuredImage = result.url;
      featuredImageThumbnail = result.thumbnail.url;
    }

    return await this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        featuredImage,
        featuredImageThumbnail,
      },
    });
  }

  async deletePost(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    
    if (post?.featuredImage) {
      const fileKey = post.featuredImage.split('/uploads/')[1];
      await this.fileStorage.deleteFile(fileKey);
    }

    return await this.prisma.post.delete({ where: { id } });
  }
}
```

### Step 4: Update Controller (If Needed)

```typescript
import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('featuredImage'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postsService.createPost(createPostDto, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('featuredImage'))
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postsService.updatePost(+id, updatePostDto, file);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
```

## Option 2: Using S3 Storage

### Step 1: Install AWS SDK

```bash
cd apps/backend
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Step 2: Update File Storage Service

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

  // Rest of the implementation stays exactly the same!
}
```

### Step 3: Add Environment Variables

Add to `.env`:

```env
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_CLOUDFRONT_URL=https://d1234567890.cloudfront.net
```

## Testing the Implementation

### 1. Test File Upload

```bash
curl -X POST http://localhost:3001/api/posts \
  -F "title=Test Post" \
  -F "content=Test content" \
  -F "featuredImage=@/path/to/image.jpg"
```

### 2. Check File Storage

**Local Storage:**
```bash
ls -la uploads/posts/
```

**S3 Storage:**
```bash
aws s3 ls s3://your-bucket/posts/
```

### 3. Verify Thumbnails

```bash
# Local
ls -la uploads/posts/*-thumb-*.jpg

# S3
aws s3 ls s3://your-bucket/posts/ | grep thumb
```

## Common Use Cases

### Upload Profile Picture with Thumbnail

```typescript
async updateUserProfile(userId: number, file: Express.Multer.File) {
  const result = await this.fileStorage.uploadWithThumbnail(file, 'avatars');
  
  return await this.prisma.user.update({
    where: { id: userId },
    data: {
      avatar: result.url,
      avatarThumbnail: result.thumbnail.url,
    },
  });
}
```

### Upload Gallery Images

```typescript
async uploadGalleryImages(files: Express.Multer.File[]) {
  const uploads = await Promise.all(
    files.map(file => this.fileStorage.uploadWithThumbnail(file, 'gallery'))
  );

  return uploads.map(upload => ({
    url: upload.url,
    thumbnail: upload.thumbnail.url,
  }));
}
```

### Custom Thumbnail Sizes

```typescript
async uploadProductImage(file: Express.Multer.File) {
  const fileKey = await this.storage.processFile(file, 'products');
  
  // Create multiple thumbnail sizes
  const thumbnailSmall = await this.storage.createThumbnail(fileKey, undefined, 150, 150);
  const thumbnailMedium = await this.storage.createThumbnail(fileKey, undefined, 300, 300);
  const thumbnailLarge = await this.storage.createThumbnail(fileKey, undefined, 600, 600);
  
  return {
    original: this.storage.getFileUrl(fileKey),
    small: this.storage.getFileUrl(thumbnailSmall),
    medium: this.storage.getFileUrl(thumbnailMedium),
    large: this.storage.getFileUrl(thumbnailLarge),
  };
}
```

## Troubleshooting

### "Cannot find module '@prisma-admin/node-utils'"

Make sure:
1. Package is built: `cd prisma-admin/packages/node-utils && npm run build`
2. Webpack alias is configured in `apps/backend/webpack.config.js`
3. TypeScript paths are configured in `apps/backend/tsconfig.json`

### Thumbnail Generation Fails

Check:
1. Sharp library is installed: `npm list sharp`
2. File is a valid image format (JPEG, PNG, WebP)
3. Sufficient disk space/memory

### S3 Upload Fails

Verify:
1. AWS credentials are correct
2. Bucket exists and is accessible
3. IAM permissions allow PutObject, GetObject, DeleteObject
4. Network connectivity to AWS

## Next Steps

1. ✅ Create FileStorageService
2. ✅ Register in CommonModule
3. ✅ Inject into your services
4. ✅ Update controllers with file upload
5. ✅ Add thumbnail fields to Prisma schema
6. ✅ Test with real uploads
7. ⏭️ Optional: Switch to S3 for production
8. ⏭️ Optional: Configure CloudFront CDN
