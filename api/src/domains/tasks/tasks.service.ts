import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource as TypeORMDataSource,
  DeepPartial,
  EntityManager,
  FindOperator,
  In,
  IsNull,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Task, TaskKinds } from './task.entity';
import { Pagination } from '../../entities/pagination.entity';
import { init as initialStat, Stat } from '../../entities/stat.entity';
import { User } from '../users/user.entity';
import { TaskStatuses } from './task.entity';
import { Project, StatusType } from '../projects/project.entity';

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
  project: {
    uuid?: string;
    slug?: string;
    status: FindOperator<StatusType>;
  };
  parent?: {
    status: FindOperator<TaskStatuses>;
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
    @InjectDataSource()
    private dataSource: TypeORMDataSource,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  get manager() {
    return this.dataSource.manager;
  }

  async find({ id, userId }: { id: string; userId: number }) {
    return await this.tasksRepository.findOne({
      relations: {
        user: true,
        project: true,
        parent: true,
        children: true,
      },
      where: {
        uuid: id,
        userId,
      },
    });
  }

  async findAll({ ids, userId }: { ids: string[]; userId: number }) {
    return await this.tasksRepository.find({
      relations: {
        user: true,
        project: true,
        parent: true,
        children: true,
      },
      where: {
        uuid: In(ids),
        userId,
      },
    });
  }

  async orphans({
    userId,
    slug,
    statuses,
  }: {
    userId: number;
    slug: string;
    statuses?: string[];
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
        status: In(statuses || ['scheduled']),
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
    statuses,
  }: {
    userId: number;
    projectSlugs: string[];
    statuses?: string[];
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
        status: In(statuses || ['scheduled']),
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

    const where = this.buildWhere({
      user,
      status: options.status,
      projectId,
      search,
      dateFrom,
      dateTo,
      dateType,
    });

    const [tasks, totalCount] = await this.tasksRepository.findAndCount({
      where,
      relations: {
        project: true,
        parent: true,
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
      .groupBy('projectId, kind')
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

    const manager = this.dataSource.manager;
    await manager.save(task);

    return task;
  }

  async update(
    user: User,
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
        children: true,
      },
      where: {
        uuid: taskId,
        user: {
          uuid: user.uuid,
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

    return this.manager.transaction(async (manager) => {
      if (task.children.length) {
        const ids = [task.uuid, ...task.children.map((it) => it.uuid)];
        await this.bulkUpdate(
          user.id,
          ids,
          { projectId: project.id },
          { manager },
        );
      }

      await manager.save(task);

      return task;
    });
  }

  async bulkUpdate(
    userId: number,
    ids: string[],
    params: {
      projectId?: number;
      status?: TaskStatuses;
      archivedAt?: string;
      finishedAt?: string;
    },
    options?: {
      manager?: EntityManager;
    },
  ) {
    const m = options?.manager || this.manager;
    await m
      .createQueryBuilder()
      .update(Task)
      .set(params)
      .where({ uuid: In(ids), userId })
      .execute();

    return await m.find(Task, {
      where: {
        uuid: In(ids),
      },
    });
  }

  async archive(
    userId: number,
    ids: string[],
    options?: {
      manager?: EntityManager;
    },
  ) {
    const now = dayjs();

    return this.bulkUpdate(
      userId,
      ids,
      {
        status: 'archived' as const,
        archivedAt: now.format(),
      },
      options,
    );
  }

  async complete(
    userId: number,
    ids: string[],
    options?: { manager?: EntityManager },
  ) {
    const now = dayjs();

    return this.bulkUpdate(
      userId,
      ids,
      {
        status: 'completed',
        finishedAt: now.format(),
      },
      options,
    );
  }

  async reopen(
    userId: number,
    ids: string[],
    options?: { manager?: EntityManager },
  ) {
    const manager = options?.manager || this.manager;
    const _options = options || {};

    return this.bulkUpdate(
      userId,
      ids,
      {
        status: 'scheduled',
        archivedAt: undefined,
        finishedAt: undefined,
      },
      {
        ..._options,
        manager,
      },
    );
  }

  private buildWhere({
    user,
    status,
    search,
    projectId,
    dateType,
    dateFrom,
    dateTo,
  }: {
    user: User;
    status: TaskStatuses[];
    search: string;
    projectId: string;
    dateType: string;
    dateFrom: string;
    dateTo: string;
  }) {
    const base: WhereParams = {
      userId: user.id,
      status: In(status),
      kind: 'task' as const,
      project: { status: In(['active']) },
    };

    if (projectId) {
      base.project.uuid = projectId;
    }

    if (search) {
      base.title = Like(`%${search}%`);
    }

    if (dateType && dateFrom && dateTo) {
      base[dateType] = Between(dateFrom, dateTo);
    } else if (dateType && dateFrom) {
      base[dateType] = MoreThanOrEqual(dateFrom);
    } else if (dateType && dateTo) {
      base[dateType] = LessThanOrEqual(dateTo);
    }

    const where = [
      {
        ...base,
        parent: { status: In(['scheduled']) },
      },
      {
        ...base,
        parent: IsNull(),
      },
    ];

    return where;
  }
}
