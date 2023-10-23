import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { IsIn } from 'class-validator';
import { StatusType, Status } from '../projects/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { Dto } from '../../entities/dto.entity';
import { User as DUser } from './user.decorator';
import { User } from './user.entity';

class UpdateStatusDto extends Dto<Required<UpdateStatusDto>> {
  @IsIn(Object.keys(Status))
  status: StatusType;
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

  // @Post()
  // async create(
  //   @DUser() user: User,
  // ): Promise<Record<string, any>> {
  //   return await this.projectsService.findOne({
  //     user,
  //     slug
  //   });
  // }

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
    @Body() body: any,
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
