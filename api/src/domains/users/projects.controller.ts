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

class UpdateProjectDto extends Dto<Required<UpdateProjectDto>> {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  deadline: Date;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  goal: string;

  @IsOptional()
  shouldbe?: string;
}

@Controller('users/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('')
  async index(
    @DUser() user: User,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('status') statuses: StatusType[],
  ): Promise<Record<string, any>> {
    const result = await this.projectsService.search({
      user,
      limit,
      page,
      statuses,
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
  @HttpCode(200)
  async update(
    @DUser() user: User,
    @Param('slug') slug: string,
    @Body() body: UpdateProjectDto,
  ) {
    await this.projectsService.update(slug, user.id, body);
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

  @Patch(':slug/archive')
  async archive(
    @DUser() user: User,
    @Param('slug') slug: string,
  ): Promise<Record<string, any>> {
    return await this.projectsService.updateStatus(user, slug, 'archived');
  }

  @Patch(':slug/reopen')
  async reopen(
    @DUser() user: User,
    @Param('slug') slug: string,
  ): Promise<Record<string, any>> {
    return await this.projectsService.updateStatus(user, slug, 'active');
  }
}
