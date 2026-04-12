import { beforeEach, describe, expect, it, vi } from 'vitest';

const usersModel = {
  findByUsername: vi.fn(),
};

vi.mock('../models/users.js', () => ({ usersModel }));

const { usersService } = await import('./users.js');

describe('usersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ユーザーがいれば返す', async () => {
    usersModel.findByUsername.mockResolvedValue({ username: 'user 1' });

    await expect(usersService.getMe('user 1')).resolves.toEqual({ username: 'user 1' });
  });

  it('ユーザーがいなければ 401', async () => {
    usersModel.findByUsername.mockResolvedValue(null);

    await expect(usersService.getMe('missing')).rejects.toMatchObject({
      statusCode: 401,
      message: 'Unauthorized',
    });
  });
});
