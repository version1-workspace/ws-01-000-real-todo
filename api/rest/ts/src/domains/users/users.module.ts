import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { ProjectsController } from './projects.controller';
import { User } from './user.entity';
import { Project } from '../projects/project.entity';
import { ProjectsModule } from '../projects/projects.module';
import { TagsController } from './tags.controller';
import { TagsModule } from '../tags/tags.module';
import { TasksController } from './tasks.controller';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project]),
    ProjectsModule,
    TasksModule,
    TagsModule,
  ],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [
    UserController,
    ProjectsController,
    TagsController,
    TasksController,
  ],
})
export class UsersModule {}
