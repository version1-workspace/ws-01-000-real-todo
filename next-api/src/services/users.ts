import { HttpError } from '../lib/http-error.js';
import { usersModel } from '../models/users.js';

export const usersService = {
  async getMe(username: string) {
    const user = await usersModel.findByUsername(username);
    if (!user) {
      throw new HttpError(401, 'Unauthorized');
    }

    return user;
  },
};
