import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  api: {
    version: 'v1',
    tokenExpiresIn: 30 * 60 * 1000 // 30 min
  },
}));
