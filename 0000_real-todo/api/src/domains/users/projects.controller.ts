import { Controller, Get, Query } from '@nestjs/common';
import { Pagination } from '../../entities/pagination.entity';
import { ProjectsService } from '../projects/projects.service';
import { User as DUser } from './user.decorator';
import { User } from './user.entity';

@Controller('users')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('projects')
  async index(
    @DUser() user: User,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<Record<string, any>> {
    const sortOptions = {
      sortType: 'deadline' as const,
      sortOrder: 'asc' as const,
    };
    const [projects, totalCount] = await this.projectsService.search({
      user,
      limit,
      page,
      ...sortOptions,
    });

    const result = new Pagination({
      data: projects,
      limit,
      page,
      totalCount,
      ...sortOptions,
    });

    return result.serialize;
  }
}
