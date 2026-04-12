import { beforeEach, describe, expect, it, vi } from 'vitest';

const projectsModel = {
  findMany: vi.fn(),
  count: vi.fn(),
  findBySlug: vi.fn(),
  update: vi.fn(),
};

const tasksService = {
  stats: vi.fn(),
  milestones: vi.fn(),
};

const prisma = {
  $transaction: vi.fn(),
};

vi.mock('../models/projects.js', () => ({ projectsModel }));
vi.mock('./tasks.js', () => ({ tasksService }));
vi.mock('../models/prisma.js', () => ({
  prisma,
  Prisma: {},
}));

const { projectsService } = await import('./projects.js');

describe('projectsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('list は active を既定にして stats と milestones を合成する', async () => {
    projectsModel.findMany.mockResolvedValue([{ id: 1, slug: 'programming' }]);
    projectsModel.count.mockResolvedValue(1);
    tasksService.stats.mockResolvedValue({
      1: {
        total: 2,
        kinds: { milestone: 1, task: 1 },
        states: { scheduled: 1, completed: 1, archived: 0 },
      },
    });
    tasksService.milestones.mockResolvedValue({ milestones: [{ id: 10 }] });

    const result = await projectsService.list({ userId: 1 });

    expect(projectsModel.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: 1,
          status: {
            in: ['active'],
          },
        },
      }),
    );
    expect(result.data[0]).toEqual({
      project: { id: 1, slug: 'programming' },
      milestones: [{ id: 10 }],
      stats: {
        total: 2,
        kinds: { milestone: 1, task: 1 },
        states: { scheduled: 1, completed: 1, archived: 0 },
      },
    });
  });

  it('create は transaction 内で project と milestone を作る', async () => {
    const createProject = vi.fn().mockResolvedValue({ id: 11 });
    const createManyTask = vi.fn().mockResolvedValue(undefined);
    prisma.$transaction.mockImplementation(async (callback: (tx: unknown) => unknown) =>
      callback({
        project: { create: createProject },
        task: { createMany: createManyTask },
      }),
    );

    await projectsService.create({
      userId: 1,
      name: 'Project',
      deadline: '2026-01-01',
      status: 'active',
      slug: 'project',
      goal: 'Goal',
      milestones: [{ title: 'm1', deadline: '2026-01-02' }],
    });

    expect(createProject).toHaveBeenCalled();
    expect(createManyTask).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          expect.objectContaining({
            title: 'm1',
            projectId: 11,
            kind: 'milestone',
          }),
        ],
      }),
    );
  });

  it('updateStatus は archived のとき archivedAt を埋める', async () => {
    projectsModel.findBySlug.mockResolvedValue({ id: 1 });
    projectsModel.update.mockResolvedValue({ id: 1, status: 'archived' });

    await projectsService.updateStatus(1, 'programming', 'archived');

    expect(projectsModel.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: expect.objectContaining({
        status: 'archived',
        archivedAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    });
  });
});
