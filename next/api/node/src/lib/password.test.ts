import { describe, expect, it } from 'vitest';
import {
  comparePassword,
  generateRefreshToken,
  hashPassword,
  stretchCount,
} from './password.js';

describe('password lib', () => {
  it('stretchCount は 1 未満にならない', () => {
    expect(stretchCount(new Date('2026-01-01T00:00:00.000Z'))).toBe(1);
  });

  it('hashPassword と comparePassword が対応する', async () => {
    const createdAt = new Date('2026-01-01T00:00:13.000Z');
    const hashed = await hashPassword('secret', createdAt);

    await expect(comparePassword('secret', hashed)).resolves.toBe(true);
    await expect(comparePassword('wrong', hashed)).resolves.toBe(false);
  });

  it('generateRefreshToken は bcrypt 形式の文字列を返す', async () => {
    const token = await generateRefreshToken();

    expect(token).toMatch(/^\$2[aby]\$/);
  });
});
