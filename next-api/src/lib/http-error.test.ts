import { describe, expect, it } from 'vitest';
import { HttpError } from './http-error.js';

describe('HttpError', () => {
  it('statusCode と details を保持する', () => {
    const error = new HttpError(422, 'invalid', { field: 'email' });

    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(422);
    expect(error.message).toBe('invalid');
    expect(error.details).toEqual({ field: 'email' });
  });
});
