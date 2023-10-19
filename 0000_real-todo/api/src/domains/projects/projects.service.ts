import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { Project } from './project.entity';

interface SearchParams {
  user: User;
  limit?: number;
  page?: number;
  sortOrder: 'asc' | 'desc';
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async search({
    user,
    limit,
    page,
    sortOrder,
  }: SearchParams): Promise<[Project[], number]> {
    const take = limit || 5
    const skip = take * ((page || 1) - 1);
    return this.projectsRepository.findAndCount({
      where: {
        userId: user.id,
      },
      relations: {
        user: true,
      },
      order: {
        deadline: sortOrder,
      },
      skip,
      take,
    });
  }

  async create(params: DeepPartial<Project>): Promise<Project> {
    const project = this.projectsRepository.create(params);

    await this.projectsRepository.save(project);

    return project;
  }
}
