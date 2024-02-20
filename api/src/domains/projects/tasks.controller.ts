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
  @IsIn(['deadline', 'createdAt', 'updatedAt'])
  sortType?: 'deadline' | 'createdAt' | 'updatedAt';
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

  @Get(':slug/tasks')
  async index(
    @DUser() user: User,
    @Param('slug') slug: string,
    @Query() query: TaskIndexDto,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.search({
      slug,
      user,
      ...query,
    });

    return result.serialize;
  }
}
