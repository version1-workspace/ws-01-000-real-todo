import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { dataSourceOptions } from './db/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './domains/users/users.module';
import { ProjectsModule } from './domains/projects/projects.module';
import { TasksModule } from './domains/tasks/tasks.module';
import { BulkTasksModule } from './domains/bulk/tasks.module';
import { AuthModule } from './domains/auth/auth.module';
import { AuthGuard } from './domains/auth/auth.guard';
import appConfig from './config/app.config';
import { LoggerModule } from './lib/modules/logger/logger.module';

const config = appConfig();

const envFilePath = [`.env.${process.env.NODE_ENV || 'development'}`];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      envFilePath,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        AUTH_SECRET: Joi.string().required(),
        AUTH_SUGAR: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions as any),
    JwtModule.register({
      global: true,
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: config.api.tokenExpiresIn },
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    BulkTasksModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
