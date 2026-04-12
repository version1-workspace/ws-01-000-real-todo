import { beforeEach, describe, expect, it, vi } from 'vitest';

const projectsModel = {
  findByUuid: vi.fn(),
};

const tasksModel = {
  findMany: vi.fn(),
  count: vi.fn(),
  create: vi.fn(),
  findFirst: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
};

const prisma = {
  task: {
    groupBy: vi.fn(),
  },
};

vi.mock('../models/projects.js', () => ({ projectsModel }));
vi.mock('../models/tasks.js', () => ({
  tasksModel,
  taskInclude: { project: true, parent: true, children: true, tagTasks: true },
}));
vi.mock('../models/prisma.js', () => ({
  prisma,
  Prisma: {},
}));

const { tasksService } = await import('./tasks.js');

describe('tasksService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('project が見つからなければ create は 404', async () => {
    projectsModel.findByUuid.mockResolvedValue(null);

    await expect(
      tasksService.create({
        userId: 1,
        title: 'Task',
        projectId: 'project-uuid',
        deadline: '2026-01-01',
        status: 'scheduled',
        kind: 'task',
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: 'Project not found',
    });
  });

  it('search は OR 条件と pageInfo を組み立てる', async () => {
    tasksModel.findMany.mockResolvedValue([{ id: 1 }]);
    tasksModel.count.mockResolvedValue(12);

    const result = await tasksService.search({
      userId: 1,
      status: ['scheduled'],
      page: 2,
      limit: 5,
      search: 'Task',
      projectId: 'project-uuid',
    });

    expect(tasksModel.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.any(Array),
        }),
        take: 5,
        skip: 5,
      }),
    );
    expect(result.pageInfo).toEqual({
      page: 2,
      limit: 5,
      sortOrder: 'asc',
      sortType: 'deadline',
      hasNext: true,
      hasPrevious: true,
      totalCount: 12,
    });
  });

  it('project 変更時は子タスクも updateMany する', async () => {
    vi.spyOn(tasksService, 'findOne').mockResolvedValue({
      id: 10,
      projectId: 1,
      children: [{ id: 21 }, { id: 22 }],
    } as never);
    projectsModel.findByUuid.mockResolvedValue({ id: 2 });
    tasksModel.update.mockResolvedValue({ id: 10, projectId: 2 });

    await tasksService.update(1, 'task-uuid', {
      projectId: 'project-uuid',
      title: 'Updated',
    });

    expect(tasksModel.updateMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: [21, 22],
        },
        userId: 1,
      },
      data: expect.objectContaining({
        projectId: 2,
      }),
    });
  });

  it('stats は groupBy の結果を project ごとに集約する', async () => {
    prisma.task.groupBy
      .mockResolvedValueOnce([
        { projectId: 1, kind: 'task', _count: { _all: 3 } },
        { projectId: 1, kind: 'milestone', _count: { _all: 2 } },
      ])
      .mockResolvedValueOnce([
        { projectId: 1, status: 'scheduled', _count: { _all: 4 } },
        { projectId: 1, status: 'completed', _count: { _all: 1 } },
      ]);

    await expect(tasksService.stats([1])).resolves.toEqual({
      1: {
        total: 5,
        kinds: { task: 3, milestone: 2 },
        states: { scheduled: 4, completed: 1, archived: 0 },
      },
    });
  });
});
