import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AppDataSource } from './db/config';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource as any), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
