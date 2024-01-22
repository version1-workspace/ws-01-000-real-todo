import {
  Controller,
  Get,
  Patch,
  Put,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { User as DUser } from './user.decorator';
import { User } from './user.entity';
import { TaskStatuses } from '../tasks/task.entity';

@Controller('users/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('')
  async index(
    @DUser() user: User,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('status') status: TaskStatuses[],
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.search({
      user,
      status,
      limit,
      page,
    });

    return result.serialize;
  }

  @Patch(':taskId')
  async update(
    @DUser() user: User,
    @Param('taskId') taskId: string,
    @Body() body: Record<string, any>,
  ): Promise<Record<string, any>> {
    const { status } = body;
    const result = await this.tasksService.update(user.uuid, taskId, {
      status,
    });

    return { data: result };
  }

  @Put(':taskId/archive')
  async archive(
    @DUser() user: User,
    @Param('taskId') taskId: string,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.archive(user.uuid, taskId);

    return { data: result };
  }

  @Put(':taskId/complete')
  async complete(
    @DUser() user: User,
    @Param('taskId') taskId: string,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.complete(user.uuid, taskId);

    return { data: result };
  }

  @Put(':taskId/reopen')
  async reopen(
    @DUser() user: User,
    @Param('taskId') taskId: string,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.reopen(user.uuid, taskId);

    return { data: result };
  }
}
