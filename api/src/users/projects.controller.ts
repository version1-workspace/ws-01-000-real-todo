import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class ProjectsController {
  constructor(private readonly userService: UsersService) {}

  @Get('projects')
  async index(@Req() request: Request): Promise<Record<string, any>> {
    return {
      data: [],
      pageInfo: {
        page: 0,
        limit: 0,
        hasNext: 0,
        hasPrevious: 0,
        totalCount: 0,
      }
    };
  }
}
