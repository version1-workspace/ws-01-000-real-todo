import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Pagination } from '../../entities/pagination.entity';
import { User } from '../users/user.entity';
import { Project } from './project.entity';
import { TasksService } from '../tasks/tasks.service';

interface SearchParams {
  user: User;
  limit?: number;
  page?: number;
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
      project.milestones = milestones[project.id] || []
    })

    const stats = await this.tasksService.statics(projectIds)
    projects.forEach((p: Project) => {
      p.stats = stats[p.id] || { total: 0 }
    })

    const result = new Pagination({
      data: projects,
      limit,
      page,
      totalCount,
      ...sortOptions,
    });

    return result;
  }

  async create(params: DeepPartial<Project>): Promise<Project> {
    const project = this.projectsRepository.create(params);

    await this.projectsRepository.save(project);

    return project;
  }
}
