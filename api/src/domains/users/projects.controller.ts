import {
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Param,
  Body,
  HttpCode,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { IsIn, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { StatusType, Status } from '../projects/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { Dto } from '../../entities/dto.entity';
import { User as DUser } from './user.decorator';
import { User } from './user.entity';
import { Response } from 'express';

class TaskDto extends Dto<TaskDto> {
  @IsNotEmpty()
  title: string;

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
      statuses: statuses && !Array.isArray(statuses) ? [statuses] : statuses,
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<Record<string, any>> {
    const data = await this.projectsService.findOne({
      user,
      slug,
    });

    if (data) {
      return {
        data,
      };
    } else {
      res.status(HttpStatus.NOT_FOUND);
      return;
    }
  }

  @Patch(':slug')
  @HttpCode(200)
  async update(
    @DUser() user: User,
    @Param('slug') slug: string,
    @Body() body: UpdateProjectDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const project = await this.projectsService.update(slug, user.id, body);
    if (!project) {
      res.status(HttpStatus.BAD_REQUEST);
      return;
    }
  }

  @Patch(':slug/archive')
  async archive(
    @DUser() user: User,
    @Param('slug') slug: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Record<string, any>> {
    const project = await this.projectsService.updateStatus(
      user,
      slug,
      'archived',
    );
    if (project) {
      return { data: project };
    } else {
      res.json(HttpStatus.NOT_FOUND);
      return;
    }
  }

  @Patch(':slug/reopen')
  async reopen(
    @DUser() user: User,
    @Param('slug') slug: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Record<string, any>> {
    const project = await this.projectsService.updateStatus(
      user,
      slug,
      'active',
    );
    if (project) {
      return { data: project };
    } else {
      res.json(HttpStatus.NOT_FOUND);
      return;
    }
  }
}
