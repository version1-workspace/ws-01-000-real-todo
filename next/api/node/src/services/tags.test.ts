import { beforeEach, describe, expect, it, vi } from 'vitest';

const tagsModel = {
  findMany: vi.fn(),
  count: vi.fn(),
};

vi.mock('../models/tags.js', () => ({ tagsModel }));

const { tagsService } = await import('./tags.js');

describe('tagsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('デフォルトのソートとページ情報で一覧を返す', async () => {
    tagsModel.findMany.mockResolvedValue([{ id: 1 }]);
    tagsModel.count.mockResolvedValue(1);

    const result = await tagsService.list({ userId: 1 });

    expect(tagsModel.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: 1,
          status: {
            in: [],
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
        skip: 0,
      }),
    );
    expect(result.pageInfo).toEqual({
      page: 1,
      limit: 20,
      sortOrder: 'desc',
      sortType: 'createdAt',
      hasNext: false,
      hasPrevious: false,
      totalCount: 1,
    });
  });
});
