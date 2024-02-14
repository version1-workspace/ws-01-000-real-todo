import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Pagination } from '../../entities/pagination.entity';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
import { init as initialStat } from '../../entities/stat.entity';
import { Project, StatusType } from './project.entity';
import { TasksService } from '../tasks/tasks.service';
import { toMap } from '../../lib/utils';

interface SearchParams {
  user: User;
  limit?: number;
  page?: number;
}

interface ProjectParams {
  user: User;
  slug: string;
}

interface UpdateStatusParams extends ProjectParams {
  status: StatusType;
}

interface UpdateParams extends ProjectParams {
  project: {
    name?: string;
    deadline?: string;
    startingAt?: string;
    startedAt?: string;
    finishedAt?: string;
    slug?: string;
    goal?: string;
    shouldbe?: string;
    milestones?: DeepPartial<Task>[];
  };
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
      page,
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

  async update(params: UpdateParams): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: {
        slug: params.slug,
        userId: params.user.id,
      },
    });

    const { milestones: _, ...rest } = params.project;

    Object.assign(project, rest);

    await this.projectsRepository.save(project);

    return project;
  }

  async updateStatus(params: UpdateStatusParams): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: {
        slug: params.slug,
        userId: params.user.id,
      },
    });

    project.status = params.status;

    await this.projectsRepository.save(project);

    return project;
  }
}
