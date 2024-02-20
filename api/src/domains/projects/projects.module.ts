import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from '../tasks/tasks.module';
import { Task } from '../tasks/task.entity';
import { Project } from './project.entity';
import { ProjectsService } from './projects.service';
import { TasksController } from './tasks.controller';
import { MilestonesController } from './milestones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task]), TasksModule],
  providers: [ProjectsService],
  exports: [ProjectsService],
  controllers: [TasksController, MilestonesController],
})
export class ProjectsModule {}
