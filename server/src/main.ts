import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;
  const clientOrigin = configService.get<string>('CLIENT_ORIGIN') || 'http://localhost:5173';

  // Global API route prefix: /api
  app.setGlobalPrefix('api');

  // Configure CORS for React client
  app.enableCors({
    origin: [clientOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global request validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
  logger.log(`🚀 AlumniConnect API server is running on: http://localhost:${port}/api`);
  logger.log(`🩺 Health check available at: http://localhost:${port}/api/health`);
}

bootstrap();
