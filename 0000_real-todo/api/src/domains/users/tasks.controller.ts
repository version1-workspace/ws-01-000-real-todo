import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { User as DUser } from './user.decorator';
import { User } from './user.entity';
import { TaskKinds, TaskStatuses } from '../tasks/task.entity';

interface CreateParams {
  title: string;
  projectId: string;
  deadline: string;
  startingAt: string;
  status: TaskStatuses;
  kind: TaskKinds;
}

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

  @Post('')
  async create(
    @DUser() user: User,
    @Body() body: CreateParams,
  ): Promise<Record<string, any>> {
    const { title, projectId, status, kind, deadline, startingAt } = body;
    const result = await this.tasksService.create(user.id, projectId, {
      title,
      kind,
      status,
      deadline,
      startingAt,
    });

    return { data: result };
  }

  @Get(':id')
  async show(
    @DUser() user: User,
    @Param('id') id: string,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.find({
      id,
      userId: user.id,
    });

    return { data: result };
  }

  @Patch(':id')
  async update(
    @DUser() user: User,
    @Param('id') id: string,
    @Body() body: Record<string, any>,
  ): Promise<Record<string, any>> {
    console.log('body ==========', id, body);
    const _body = Object.keys(body).reduce((acc: any, key: string) => {
      if (
        [
          'title',
          'projectId',
          'status',
          'kind',
          'deadline',
          'finishedAt',
          'startingAt',
        ].includes(key)
      ) {
        return {
          ...acc,
          [key]: body[key],
        };
      }
    }, {});
    const result = await this.tasksService.update(user.uuid, id, _body);

    return { data: result };
  }

  @Put(':taskId/archive')
  async archive(
    @DUser() user: User,
    @Param('taskId') taskId: string,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.archive(user.id, [taskId]);

    return { data: result };
  }

  @Put(':taskId/complete')
  async complete(
    @DUser() user: User,
    @Param('taskId') taskId: string,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.complete(user.id, [taskId]);

    return { data: result };
  }

  @Put(':taskId/reopen')
  async reopen(
    @DUser() user: User,
    @Param('taskId') taskId: string,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.reopen(user.id, [taskId]);

    return { data: result };
  }
}
