import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const api = await NestFactory.create(AppModule);
  api.setGlobalPrefix('api');
  api.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  await api.listen(3000);
}
bootstrap();
