import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeepPartial, FindOperator, In, IsNull, Like, Repository } from 'typeorm';
import { Task, TaskKinds } from './task.entity';
import { Pagination } from '../../entities/pagination.entity';
import { init as initialStat, Stat } from '../../entities/stat.entity';
import { User } from '../users/user.entity';
import { TaskStatuses } from './task.entity';
import { Project } from '../projects/project.entity';

export type SortType = 'deadline' | 'startedAt' | 'updatedAt' | 'createdAt';
export type OrderType = 'asc' | 'desc';

interface SearchParams {
  user: User;
  projectId?: string;
  slug?: string;
  search?: string;
  sortType?: SortType;
  sortOrder?: OrderType;
  dateFrom?: string;
  dateTo?: string;
  dateType?: string;
  status?: TaskStatuses[];
  page?: number;
  limit?: number;
}

interface WhereParams {
  project?: {
    uuid?: string;
    slug?: string;
  };
  title?: FindOperator<string>;
  kind: TaskKinds;
  userId: number;
  status: FindOperator<any>;
}

const sortOptions = (t: SortType, o: OrderType) => {
  return {
    deadline: {
      deadline: o,
    },
    createdAt: {
      createdAt: o,
    },
    updatedAt: {
      updatedAt: o,
    },
    startedAt: {
      startedAt: o,
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

  async find({ id, userId }: { id: string; userId: number }) {
    return await this.tasksRepository.findOne({
      relations: {
        user: true,
        project: true,
      },
      where: {
        uuid: id,
        userId,
      },
    });
  }

  async orphans({
    userId,
    slug,
  }: {
    userId: number;
    slug: string;
  }): Promise<Task[]> {
    return await this.tasksRepository.find({
      relations: {
        user: true,
        project: true,
        children: true,
      },
      where: {
        kind: 'task',
        parentId: IsNull(),
        userId,
        project: {
          slug,
        },
      },
      order: {
        deadline: 'desc',
      },
    });
  }

  async milestones({
    userId,
    projectSlugs,
  }: {
    userId: number;
    projectSlugs: string[];
  }): Promise<Task[]> {
    return await this.tasksRepository.find({
      relations: {
        user: true,
        project: true,
        children: true,
      },
      where: {
        kind: 'milestone',
        userId,
        project: {
          slug: In(projectSlugs),
        },
      },
      order: {
        deadline: 'asc',
      },
    });
  }

  async search({
    user,
    search,
    projectId,
    slug,
    sortType,
    sortOrder,
    dateType,
    dateFrom,
    dateTo,
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

    let where: WhereParams = {
      userId: user.id,
      status: In(options.status),
      kind: 'task' as const,
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

    if (search) {
      where = {
        ...where,
        title: Like(`%${search}%`),
      };
    }

    if (dateType && (dateFrom || dateTo)) {
      where = {
        ...where,
        [dateType]: Between(dateFrom, dateTo),
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

  async statics(ids: number[]): Promise<Record<number, Stat>> {
    const kindStats = await this.tasksRepository
      .createQueryBuilder('tasks')
      .select('projectId, kind, count(*) as count')
      .where('tasks.projectId IN(:id)', { id: ids })
      .groupBy('projectId')
      .addGroupBy('kind')
      .getRawMany();

    const r1 = kindStats.reduce((acc, it) => {
      const summary = acc[it.projectId] || initialStat();
      summary.kinds[it.kind] = Number(it.count);

      return {
        ...acc,
        [it.projectId]: summary,
      };
    }, {});

    const stateStats = await this.tasksRepository
      .createQueryBuilder('tasks')
      .select('projectId, status, count(*) as count')
      .where('tasks.projectId IN(:id)', { id: ids })
      .groupBy('projectId')
      .addGroupBy('status')
      .getRawMany();

    return stateStats.reduce((acc, it) => {
      const summary = acc[it.projectId] || initialStat();
      summary.states[it.status] = Number(it.count);
      summary.total = summary.total + Number(it.count);

      return {
        ...acc,
        [it.projectId]: summary,
      };
    }, r1);
  }

  build(params: DeepPartial<Task>) {
    return this.tasksRepository.create(params);
  }

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
      projectId: string;
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
    const { projectId, ...rest } = values;
    const project = await this.projectRepository.findOne({
      where: {
        uuid: projectId,
      },
    });
    if (project) {
      task.projectId = project.id;
    }

    Object.keys(rest).forEach((key: string) => {
      task[key] = values[key];
    });

    const manager = this.tasksRepository.manager;
    await manager.save(task);

    return task;
  }

  async bulkUpdate(
    userId: number,
    ids: string[],
    params: { status: TaskStatuses; archivedAt?: string; finishedAt?: string },
  ) {
    await this.tasksRepository
      .createQueryBuilder()
      .update(Task)
      .set(params)
      .where({ uuid: In(ids), userId })
      .execute();
  }

  async archive(userId: number, ids: string[]) {
    const now = dayjs();
    return this.bulkUpdate(userId, ids, {
      status: 'archived' as const,
      archivedAt: now.format(),
    });
  }

  async complete(userId: number, ids: string[]) {
    const now = dayjs();
    return this.bulkUpdate(userId, ids, {
      status: 'completed',
      finishedAt: now.format(),
    });
  }

  async reopen(userId: number, ids: string[]) {
    return this.bulkUpdate(userId, ids, {
      status: 'scheduled',
      archivedAt: undefined,
      finishedAt: undefined,
    });
  }
}
