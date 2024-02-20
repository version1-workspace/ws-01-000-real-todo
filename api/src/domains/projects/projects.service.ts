import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { Pagination } from '../../entities/pagination.entity';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
import { init as initialStat } from '../../entities/stat.entity';
import { Project, StatusType } from './project.entity';
import { TasksService } from '../tasks/tasks.service';
import { toMap } from '../../lib/utils';

interface SearchParams {
  user: User;
  statuses?: StatusType[];
  limit?: number;
  page?: number;
}

interface ProjectParams {
  user: User;
  slug: string;
}

interface UpdateParams {
  name?: string;
  slug?: string;
  goal?: string;
  shouldbe?: string;
  deadline?: Date;
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private tasksService: TasksService,
  ) {}

  async search({
    user,
    limit,
    statuses,
    page,
  }: SearchParams): Promise<Pagination<Project, 'deadline'>> {
    const sortOptions = {
      sortType: 'deadline' as const,
      sortOrder: 'asc' as const,
    };

    const take = limit || 5;
    const skip = take * ((page || 1) - 1);
    const [projects, totalCount] = await this.projectsRepository.findAndCount({
      where: {
        userId: user.id,
        status: In(statuses || ['active']),
      },
      relations: {
        user: true,
      },
      order: {
        deadline: sortOptions.sortOrder,
      },
      skip,
      take,
    });

    const projectSlugs = projects.map((it) => it.slug);
    const milestones = toMap(
      await this.tasksService.milestones({
        userId: user.id,
        projectSlugs,
      }),
    );
    projects.forEach((project) => {
      project.milestones = milestones[project.id] || ([] as Task[]);
    });

    const projectIds = projects.map((it) => it.id);
    const stats = await this.tasksService.statics(projectIds);
    projects.forEach((p: Project) => {
      p.stats = stats[p.id] || initialStat();
    });

    const result = new Pagination({
      data: projects,
      limit,
      page: page || 1,
      totalCount,
      ...sortOptions,
    });

    return result;
  }

  async findOne({ user, slug }: ProjectParams): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: {
        userId: user.id,
        slug: slug,
      },
      relations: {
        user: true,
      },
    });

    const milestones = toMap(
      await this.tasksService.milestones({
        userId: user.id,
        projectSlugs: [project.slug],
      }),
    );
    project.milestones = milestones[project.id] || ([] as Task[]);

    const stats = await this.tasksService.statics([project.id]);
    project.stats = stats[project.id] || initialStat();

    return project;
  }

  async create(params: DeepPartial<Project>): Promise<Project> {
    return this.projectsRepository.manager.transaction(async (manager) => {
      const { milestones, ...rest } = params;
      const project = this.projectsRepository.create(rest);

      await manager.save(project);

      project.tasks = await Promise.all(
        milestones.map((it: DeepPartial<Task>) => {
          const milestone = this.tasksService.build({
            ...it,
            projectId: project.id,
            userId: params.userId,
            kind: 'milestone',
            status: 'scheduled',
          });
          return manager.save(Task, milestone);
        }),
      );

      await manager.save(project);

      return project;
    });
  }

  async update(
    slug: string,
    userId: number,
    params: UpdateParams,
  ): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: {
        slug,
        userId,
      },
    });

    Object.assign(project, params);

    await this.projectsRepository.save(project);

    return project;
  }

  async updateStatus(
    user: User,
    slug: string,
    status: StatusType,
  ): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      relations: {
        tasks: true,
      },
      where: {
        slug,
        userId: user.id,
      },
    });

    project.status = status;

    await this.projectsRepository.save(project);

    return project;
  }
}
