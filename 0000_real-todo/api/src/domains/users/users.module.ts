import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { ProjectsController } from './projects.controller';
import { User } from './user.entity';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProjectsModule],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UserController, ProjectsController],
})
export class UsersModule {}
