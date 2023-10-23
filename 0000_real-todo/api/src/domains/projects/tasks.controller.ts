import { Controller, Get, Param, Query } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { User as DUser } from '../users/user.decorator';
import { User } from '../users/user.entity';
import { Dto } from '../../entities/dto.entity';
import { TaskStatuses } from '../tasks/task.entity';
import {
  IsNumberString,
  IsIn,
  IsArray,
  IsOptional,
  IsDefined,
} from 'class-validator';

class TaskIndexDto extends Dto<TaskIndexDto> {
  @IsOptional()
  @IsIn(['deadline', 'created', 'updated'])
  sortType?: 'deadline' | 'created' | 'updated';
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
  @IsOptional()
  @IsNumberString()
  limit?: number;
  @IsOptional()
  @IsNumberString()
  page?: number;
  @IsDefined()
  @IsArray()
  status: TaskStatuses[];
}

@Controller('projects')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':projectId/tasks')
  async index(
    @DUser() user: User,
    @Param('projectId') projectId: string,
    @Query() query: TaskIndexDto,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.search({
      projectId,
      user,
      ...query,
    });

    return result.serialize;
  }
}
