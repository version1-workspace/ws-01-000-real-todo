import { Controller, Get, Query } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { User as DUser } from './user.decorator';
import { User } from './user.entity';

@Controller('users/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('')
  async index(
    @DUser() user: User,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.search({
      user,
      limit,
      page,
    });

    return result.serialize;
  }
}
