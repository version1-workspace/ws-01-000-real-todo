import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from '../tasks/tasks.service';
import { Task } from '../tasks/task.entity';
import { Project } from '../projects/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task, Project])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class BulkTasksModule {}
