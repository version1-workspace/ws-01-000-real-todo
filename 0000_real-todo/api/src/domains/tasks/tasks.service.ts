import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, In, Repository } from 'typeorm';
import { Task, TaskKinds } from './task.entity';
import { Pagination } from '../../entities/pagination.entity';
import { Stat } from '../../entities/stat.entity';
import { User } from '../users/user.entity';
import { TaskStatuses } from './task.entity';
import { Project } from '../projects/project.entity';

type SortType = 'deadline' | 'started' | 'updated' | 'created';
type OrderType = 'asc' | 'desc';

interface SearchParams {
  user: User;
  projectId?: string;
  slug?: string;
  limit?: number;
  sortType?: SortType;
  sortOrder?: OrderType;
  status?: TaskStatuses[];
  page?: number;
}

interface WhereParms {
  project?: {
    uuid?: string;
    slug?: string;
  };
  userId: number;
  status: FindOperator<any>;
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
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async search({
    user,
    projectId,
    slug,
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

    let where: WhereParms = {
      userId: user.id,
      status: In(options.status),
    };

    if (projectId) {
      where = {
        ...where,
        project: { uuid: projectId },
      };
    }
    if (slug) {
      where = {
        ...where,
        project: { slug },
      };
    }

    const [tasks, totalCount] = await this.tasksRepository.findAndCount({
      where,
      relations: {
        project: true,
        user: true,
        tags: true,
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

  async milestones(ids: number[]): Promise<Record<number, Task[]>> {
    const milestones = await this.tasksRepository.find({
      where: {
        projectId: In(ids),
        kind: 'milestone' as const,
      },
    });

    return milestones.reduce((acc: Record<number, Task[]>, it: Task) => {
      const list = acc[it.projectId] || [];
      return { ...acc, [it.projectId]: [...list, it] };
    }, {});
  }

  async statics(ids: number[]): Promise<Record<number, Stat>> {
    const stats = await this.tasksRepository
      .createQueryBuilder('tasks')
      .select('projectId, kind, count(*) as count')
      .where('tasks.projectId IN(:id)', { id: ids })
      .groupBy('projectId')
      .addGroupBy('kind')
      .getRawMany();

    return stats.reduce((acc, it) => {
      const summary = acc[it.projectId] || { total: 0 };
      summary[it.kind] = Number(it.count);
      summary.total = (summary.total || 0) + Number(it.count);

      return {
        ...acc,
        [it.projectId]: summary,
      };
    }, {});
  }

  build = this.tasksRepository.create;

  async create(
    userId: number,
    projectId: string,
    values: {
      status: TaskStatuses;
      title: string;
      kind: TaskKinds;
      deadline: string;
      startingAt: string;
    },
  ) {
    const project = await this.projectRepository.findOne({
      where: { uuid: projectId },
    });
    const task = this.tasksRepository.create([
      {
        ...values,
        userId,
        projectId: project.id,
      },
    ]);

    const manager = this.tasksRepository.manager;
    await manager.save(task);

    return task;
  }

  async update(
    userId: string,
    taskId: string,
    values: Partial<{
      status: TaskStatuses;
      title: string;
      kind: TaskKinds;
      deadline: string;
      startingAt: string;
      startedAt: string;
      finishedAt: string;
      archivedAt: string;
    }>,
  ) {
    const task = await this.tasksRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        uuid: taskId,
        user: {
          uuid: userId,
        },
      },
    });
    Object.keys(values).forEach((key: string) => {
      task[key] = values[key];
    });

    const manager = this.tasksRepository.manager;
    await manager.save(task);

    return task;
  }

  async archive(userId: string, taskId: string) {
    const now = dayjs();
    return this.update(userId, taskId, {
      status: 'archived',
      archivedAt: now.format(),
    });
  }

  async complete(userId: string, taskId: string) {
    const now = dayjs();
    return this.update(userId, taskId, {
      status: 'completed',
      finishedAt: now.format(),
    });
  }

  async reopen(userId: string, taskId: string) {
    const now = dayjs();
    return this.update(userId, taskId, {
      status: 'scheduled',
      finishedAt: now.format(),
    });
  }
}
