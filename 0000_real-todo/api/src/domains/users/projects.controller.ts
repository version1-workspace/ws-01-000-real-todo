import { Controller, Get, Query } from '@nestjs/common';
import { Pagination } from '../../entities/pagination.entity';
import { ProjectsService } from '../projects/projects.service';
import { User as DUser } from './user.decorator';
import { User } from './user.entity';

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
}
