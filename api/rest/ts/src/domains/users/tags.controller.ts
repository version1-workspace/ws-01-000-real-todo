import { Controller, Get, Query } from '@nestjs/common';
import {
  TagsService,
  SortType,
  SortOrder,
  StatusType,
} from '../tags/tags.service';
import { User as DUser } from './user.decorator';
import { User } from './user.entity';

@Controller('users/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('')
  async index(
    @DUser() user: User,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('status') status: StatusType[],
    @Query('sortType') sortType: SortType,
    @Query('sortOrder') sortOrder: SortOrder,
  ): Promise<Record<string, any>> {
    const result = await this.tagsService.search({
      user,
      limit,
      page,
      status,
      sortType,
      sortOrder,
    });

    return result.serialize;
  }
}
