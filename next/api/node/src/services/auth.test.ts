import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { HttpError } from '../lib/http-error.js';

const usersModel = {
  findByEmail: vi.fn(),
  findByUuid: vi.fn(),
  updateRefreshToken: vi.fn(),
};

const prisma = {
  user: {
    findUniqueOrThrow: vi.fn(),
  },
};

const comparePassword = vi.fn();
const generateRefreshToken = vi.fn();
const signAccessToken = vi.fn();

vi.mock('../models/users.js', () => ({ usersModel }));
vi.mock('../models/prisma.js', () => ({ prisma }));
vi.mock('../lib/password.js', () => ({ comparePassword, generateRefreshToken }));
vi.mock('../lib/auth.js', () => ({ signAccessToken }));

const { authService } = await import('./auth.js');

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('存在しないメールアドレスなら 401', async () => {
    usersModel.findByEmail.mockResolvedValue(null);

    await expect(authService.login('none@example.com', 'pw')).rejects.toMatchObject({
      statusCode: 401,
      message: 'Unauthorized',
    } satisfies Partial<HttpError>);
  });

  it('パスワード不一致なら 401', async () => {
    usersModel.findByEmail.mockResolvedValue({ id: 1, password: 'hashed' });
    comparePassword.mockResolvedValue(false);

    await expect(authService.login('user@example.com', 'pw')).rejects.toMatchObject({
      statusCode: 401,
      message: 'Unauthorized',
    });
  });

  it('refresh は uuid と token が揃わないと 401', async () => {
    usersModel.findByUuid.mockResolvedValue({
      id: 1,
      uuid: 'user-uuid',
      refreshToken: 'stored-token',
    });

    await expect(authService.refresh('user-uuid', 'wrong-token')).rejects.toMatchObject({
      statusCode: 401,
      message: 'invalid refresh token or uuid',
    });
  });

  it('issueTokens は refresh token を更新して access token を返す', async () => {
    prisma.user.findUniqueOrThrow.mockResolvedValue({
      id: 1,
      username: 'user 1',
    });
    generateRefreshToken.mockResolvedValue('new-refresh-token');
    usersModel.updateRefreshToken.mockResolvedValue({
      id: 1,
      uuid: 'user-uuid',
      username: 'user 1',
      refreshToken: 'new-refresh-token',
    });
    signAccessToken.mockReturnValue('signed-access-token');

    await expect(authService.issueTokens(1)).resolves.toEqual({
      uuid: 'user-uuid',
      accessToken: 'signed-access-token',
      refreshToken: 'new-refresh-token',
    });
  });
});
