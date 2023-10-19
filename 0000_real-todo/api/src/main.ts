import { NestFactory, Reflector } from '@nestjs/core';
import { VersioningType, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const api = await NestFactory.create(AppModule);
  api.setGlobalPrefix('api');
  api.useGlobalPipes(new ValidationPipe({}));
  api.useGlobalInterceptors(new ClassSerializerInterceptor(api.get(Reflector)));
  api.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const configService = api.get(ConfigService);
  await api.listen(configService.get('PORT'));
}
bootstrap();
