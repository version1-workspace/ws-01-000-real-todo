import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { checkNoAuthBehavior, prepareApp } from '../helper';
import request from '../helper/request';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  const jwtService = { verifyAsync: () => ({ sub: 'user 1' }) };

  beforeAll(async () => {
    app = await prepareApp([
      {
        provider: JwtService,
        value: jwtService,
      },
    ]);

    server = app?.getHttpServer();
    return;
  });

  describe('Get /users/me', () => {
    const subject = () => request(server).get('/users/me');

    it(...checkNoAuthBehavior(subject));

    it(`with auth token, return 200`, async () => {
      const response = await subject().withAuth();

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        data: {
          id: 1,
          uuid: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          username: 'user 1',
          email: 'user.1@example.com',
          password: expect.any(String),
          refreshToken: expect.any(String),
          status: 'active',
        },
      });
    });

    return;
  });

  afterAll(async () => {
    await app.close();
  });
});
