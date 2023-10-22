import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { Pagination } from '../../entities/pagination.entity';
import { User } from '../users/user.entity';

export type SortType = 'updated' | 'created';
export type SortOrder = 'asc' | 'desc';
export type StatusType = 'enabled' | 'disabled'

interface SearchParams {
  user: User;
  limit?: number;
  sortType?: SortType;
  sortOrder?: SortOrder;
  status?: StatusType[];
  page?: number;
}

const sortOptions = (t: SortType, o: SortOrder) => {
  return {
    created: {
      createdAt: o,
    },
    updated: {
      updatedAt: o,
    },
  }[t];
};

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async search({
    user,
    sortType,
    sortOrder,
    limit,
    page,
    status,
  }: SearchParams): Promise<Pagination<Tag, SortType>> {
    const options = {
      status: status || [] as StatusType[],
      take: limit || 20,
      page: page || 1,
      skip: undefined,
      sortType: sortType || 'created' as const,
      sortOrder: sortOrder || 'desc' as const,
    };
    options.skip = (options.page - 1) * options.take;

    const order = sortOptions(options.sortType, options.sortOrder) || {
      createdAt: 'asc',
    };
    const { take, skip } = options;
    const [tasks, totalCount] = await this.tagsRepository.findAndCount({
      where: {
        userId: user.id,
        status: In(options.status),
      },
      relations: {
        user: true,
      },
      order,
      take,
      skip,
    });

    return new Pagination({
      data: tasks,
      totalCount,
      limit: options.take,
      page: options.page,
      sortType: options.sortType,
      sortOrder: options.sortOrder,
    });
  }
}
