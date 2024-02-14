import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Query,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { IsIn, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { StatusType, Status } from '../projects/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { Dto } from '../../entities/dto.entity';
import { User as DUser } from './user.decorator';
import { User } from './user.entity';
import { TaskKind, TaskKinds } from '../tasks/task.entity';

class UpdateStatusDto extends Dto<Required<UpdateStatusDto>> {
  @IsIn(Object.keys(Status))
  status: StatusType;
}

class TaskDto extends Dto<TaskDto> {
  @IsNotEmpty()
  title: string;

  @IsIn(Object.keys(TaskKind))
  kind: TaskKinds;

  @IsDate()
  @IsNotEmpty()
  deadline: Date;
}

class ProjectDto extends Dto<Required<ProjectDto>> {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  deadline: Date;

  @IsIn(Object.keys(Status))
  status: StatusType;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  goal: string;

  @IsOptional()
  shouldbe?: string;

  milestones: TaskDto[];
}

@Controller('users/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('')
  async index(
    @DUser() user: User,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<Record<string, any>> {
    const result = await this.projectsService.search({
      user,
      limit,
      page,
    });

    return result.serialize;
  }

  @Post()
  @HttpCode(201)
  async create(@DUser() user: User, @Body() body: ProjectDto): Promise<void> {
    const { milestones, ...rest } = body;
    await this.projectsService.create({
      userId: user.id,
      ...rest,
      milestones: milestones?.map((it) => it),
    });
  }

  @Get(':slug')
  async show(
    @DUser() user: User,
    @Param('slug') slug: string,
  ): Promise<Record<string, any>> {
    return await this.projectsService.findOne({
      user,
      slug,
    });
  }

  @Patch(':slug')
  async update(
    @DUser() user: User,
    @Param('slug') slug: string,
  ): Promise<Record<string, any>> {
    return await this.projectsService.findOne({
      user,
      slug,
    });
  }

  @Delete(':slug')
  async delete(
    @DUser() user: User,
    @Param('slug') slug: string,
  ): Promise<Record<string, any>> {
    return await this.projectsService.findOne({
      user,
      slug,
    });
  }

  @Patch(':slug/status')
  async updateStatus(
    @DUser() user: User,
    @Param('slug') slug: string,
    @Body() body: UpdateStatusDto,
  ): Promise<Record<string, any>> {
    const { status } = body;
    return await this.projectsService.updateStatus({
      user,
      slug,
      status,
    });
  }
}
