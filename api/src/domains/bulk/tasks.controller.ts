import { Body, Controller, Put } from '@nestjs/common';
import { User } from '../users/user.entity';
import { User as DUser } from '../users/user.decorator';
import { TasksService } from '../tasks/tasks.service';

@Controller('bulk/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Put('archive')
  async archive(
    @DUser() user: User,
    @Body('ids') ids: string[],
  ): Promise<Record<string, any>> {
    const tasks = await this.tasksService.archive(user.id, ids);

    return { data: tasks };
  }

  @Put('complete')
  async complete(
    @DUser() user: User,
    @Body('ids') ids: string[],
  ): Promise<Record<string, any>> {
    const tasks = await this.tasksService.complete(user.id, ids);

    return { data: tasks };
  }

  @Put('reopen')
  async reopen(
    @DUser() user: User,
    @Body('ids') ids: string[],
  ): Promise<Record<string, any>> {
    const tasks = await this.tasksService.reopen(user.id, ids);

    return { data: tasks };
  }
}
