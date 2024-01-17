import { NestFactory, Reflector } from '@nestjs/core';
import {
  VersioningType,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const api = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Authorization',
        'Content-Type',
        'Accept',
      ],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });
  api.setGlobalPrefix('api');
  api.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  api.useGlobalInterceptors(new ClassSerializerInterceptor(api.get(Reflector)));
  api.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  api.use(cookieParser());

  const configService = api.get(ConfigService);
  await api.listen(configService.get('PORT'));
}
bootstrap();
