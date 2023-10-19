import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Pagination } from '../../entities/pagination.entity';
import { User } from '../users/user.entity';
import { TaskStatuses } from './task.entity';

type SortType = 'deadline' | 'started' | 'updated' | 'created';
type OrderType = 'asc' | 'desc';

interface SearchParams {
  projectId: string;
  user: User;
  limit?: number;
  sortType?: SortType;
  sortOrder?: OrderType;
  status?: TaskStatuses[];
  page?: number;
}

const sortOptions = (t: SortType, o: OrderType) => {
  return {
    deadline: {
      deadline: o,
    },
    created: {
      createdAt: o,
    },
    updated: {
      updatedAt: o,
    },
  }[t];
};

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async search({
    projectId,
    user,
    sortType,
    sortOrder,
    limit,
    page,
    status,
  }: SearchParams): Promise<Pagination<Task, SortType>> {
    const options = {
      status: status || [],
      take: limit || 20,
      page: page || 1,
      skip: undefined,
      sortType: sortType || 'deadline',
      sortOrder: sortOrder || 'asc',
    };
    options.skip = (options.page - 1) * options.take;

    const order = sortOptions(options.sortType, options.sortOrder) || {
      deadline: 'asc',
    };
    const { take, skip } = options;
    const [tasks, totalCount] = await this.tasksRepository.findAndCount({
      where: {
        project: {
          uuid: projectId,
        },
        userId: user.id,
        status: In(options.status),
      },
      relations: {
        project: true,
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
