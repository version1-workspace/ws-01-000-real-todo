import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Pagination } from '../../entities/pagination.entity';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
import { Project, StatusType } from './project.entity';
import { TasksService } from '../tasks/tasks.service';

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

    const projectIds = projects.map((it) => it.id);
    const milestones = await this.tasksService.milestones(projectIds);
    projects.forEach((project) => {
      project.milestones = milestones[project.id] || [];
    });

    const stats = await this.tasksService.statics(projectIds);
    projects.forEach((p: Project) => {
      p.stats = stats[p.id] || { total: 0 };
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

  async findOne({
    user,
    slug
  }: ProjectParams): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: {
        userId: user.id,
        slug: slug,
      },
      relations: {
        user: true,
      },
    });

    const milestones = await this.tasksService.milestones([project.id]);
    project.milestones = milestones[project.id] || [];

    const stats = await this.tasksService.statics([project.id]);
    project.stats = stats[project.id] || { total: 0 };

    return project;
  }

  async create(params: DeepPartial<Project>): Promise<Project> {
    const { milestones, ...rest } = params
    const project = this.projectsRepository.create(rest);

    project.tasks = milestones.map((it: DeepPartial<Task>) => {
      return this.tasksService.build({
        ...it,
        userId: params.userId,
        kind: 'milestone'
      })[0]
    })

    await this.projectsRepository.save(project);

    return project;
  }

  async update(params: UpdateParams): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: {
        slug: params.slug,
        userId: params.user.id,
      },
    });

    const { milestones, ...rest } = params.project;

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
