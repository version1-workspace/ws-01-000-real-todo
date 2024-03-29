import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { OrderType, SortType, TasksService } from '../tasks/tasks.service';
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
    @Query('search') search: string,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('dateType') dateType: string,
    @Query('sortType') sortType: SortType,
    @Query('sortOrder') sortOrder: OrderType,
    @Query('projectId') projectId: string,
    @Query('status') status: TaskStatuses[],
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.search({
      user,
      status,
      projectId,
      search,
      sortType,
      sortOrder,
      dateFrom,
      dateTo,
      dateType,
      limit,
      page,
    });

    return result.serialize;
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.find({
      id,
      userId: user.id,
    });

    if (result) {
      return { data: result };
    } else {
      res.status(HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(
    @DUser() user: User,
    @Param('id') id: string,
    @Body() body: Record<string, any>,
  ): Promise<Record<string, any>> {
    const _body = Object.keys(body).reduce((acc: any, key: string) => {
      if (
        [
          'title',
          'projectId',
          'status',
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

      return acc;
    }, {});

    const result = await this.tasksService.update(user, id, _body);

    return { data: result };
  }

  @Put(':id/archive')
  async archive(
    @DUser() user: User,
    @Param('id') id: string,
  ): Promise<Record<string, any>> {
    const [task] = await this.tasksService.archive(user.id, [id]);

    return { data: task };
  }

  @Put(':id/complete')
  async complete(
    @DUser() user: User,
    @Param('id') id: string,
  ): Promise<Record<string, any>> {
    const [task] = await this.tasksService.complete(user.id, [id]);

    return { data: task };
  }

  @Put(':id/reopen')
  async reopen(
    @DUser() user: User,
    @Param('id') id: string,
  ): Promise<Record<string, any>> {
    const [task] = await this.tasksService.reopen(user.id, [id]);

    return { data: task };
  }
}
