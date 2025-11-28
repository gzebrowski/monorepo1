import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { serverConfig, publicConfig } from '@simpleblog/shared';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Serve static files from uploads directory
  const uploadDir = process.env.UPLOAD_DIR || 'uploads';
  app.useStaticAssets(join(process.cwd(), uploadDir), {
    prefix: '/uploads/',
  });

  // Enable CORS using configuration from shared config
  app.enableCors({
    origin: [serverConfig.corsOrigin, 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation (only in development)
  if (serverConfig.enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle(publicConfig.appName + ' API')
      .setDescription('API for ' + publicConfig.appName + ' Application')
      .setVersion(publicConfig.appVersion)
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    console.log(`📚 API Documentation available at http://localhost:${serverConfig.port}/api`);
  }

  await app.listen(serverConfig.port);
  
  console.log(`🚀 Server running on ${publicConfig.apiUrl}`);
  console.log(`🌍 Environment: ${serverConfig.nodeEnv}`);
}

bootstrap();