import { NestFactory, Reflector } from '@nestjs/core';
import { VersioningType, ClassSerializerInterceptor } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const api = await NestFactory.create(AppModule);
  api.setGlobalPrefix('api');
  api.useGlobalInterceptors(new ClassSerializerInterceptor(api.get(Reflector)));
  api.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const configService = api.get(ConfigService);
  await api.listen(configService.get('PORT'));
}
bootstrap();
