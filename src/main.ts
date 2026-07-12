import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AppLogger } from './common/logger/app-logger.service';
import { AllExceptionsFilter } from './config/allexceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  // Replace the default logger with our custom logger
  app.useLogger(app.get(AppLogger));

  // Apply the global prefix
  app.setGlobalPrefix('api/v1');

  // Apply validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Apply the success envelope globally
  app.useGlobalInterceptors(new TransformInterceptor());

  // Apply the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
