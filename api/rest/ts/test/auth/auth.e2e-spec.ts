import { INestApplication } from '@nestjs/common';
import { prepareApp } from '../helper';
import request from '../helper/request';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    app = await prepareApp([]);

    server = app?.getHttpServer();
    return;
  });

  describe('Post /auth/login', () => {
    const subject = () => request(server).post('/auth/login');

    it(`with right auth info, return 200`, async () => {
      const response = await subject().send({
        email: 'user.1@example.com',
        password: 'AndyBobCharrie',
      });

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        data: {
          uuid: 'fa66f863-1040-48bd-a156-11bb7cce796e',
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
      });
    });

    it(`with wrong mail address, return 401: 1`, async () => {
      const response = await subject().send({
        email: 'wrong@example.com',
        password: 'AndyBobCharrie',
      });

      expect(response.status).toEqual(401);
    });

    it(`with wrong password, return 401: 2`, async () => {
      const response = await subject().send({
        email: 'user.1@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toEqual(401);
    });
  });

  describe('Post /auth/refresh', () => {
    const subject = () => request(server).post('/auth/refresh');

    it(`with right refreshToken, return 200`, async () => {
      const client = request(server);
      const r1 = await client.post('/auth/login').send({
        email: 'user.1@example.com',
        password: 'AndyBobCharrie',
      });

      expect(r1.status).toEqual(200);
      const { uuid, refreshToken } = r1.body.data;

      const response = await client
        .post('/auth/refresh')
        .set('Cookie', `refreshToken=${refreshToken}`)
        .send({
          uuid,
        });
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        data: {
          uuid: 'fa66f863-1040-48bd-a156-11bb7cce796e',
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
      });
      expect(response.body.data.refreshToken).not.toEqual(refreshToken);
    });

    it(`with wrong refreshToken, return 401: 1`, async () => {
      const uuid = 'fa66f863-1040-48bd-a156-11bb7cce796e';
      const response = await subject().withAuth().send({
        uuid,
      });

      expect(response.status).toEqual(401);
    });
  });

  describe('Delete /auth/refresh', () => {
    const subject = () => request(server).delete('/auth/refresh');
    it(`return 200`, async () => {
      const response = await subject();
      expect(response.status).toEqual(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
