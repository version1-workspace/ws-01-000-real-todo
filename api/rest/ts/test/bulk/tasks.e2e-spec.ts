import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { checkNoAuthBehavior, prepareApp } from '../helper';
import { withCleanup } from '../helper/databse';
import request from '../helper/request';

const jwtService = { verifyAsync: () => ({ sub: 'user 1' }) };

describe('Bulk/TasksController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    app = await prepareApp([
      {
        provider: JwtService,
        value: jwtService,
      },
    ]);
    server = app.getHttpServer();

    return;
  });

  describe('Put /bulk/tasks/archive', () => {
    const uuid = [
      '067176b2-baaf-4936-b7d4-6d202ab72639',
      'c185e0c2-842e-46f0-a1e8-41d598569431',
      '36b6ee02-e4c7-40c3-8df3-f7bf4f443183',
    ];
    const subject = () => request(server).put(`/bulk/tasks/archive`);
    it(...checkNoAuthBehavior(subject));

    it('archive task', async () => {
      await withCleanup(app, async () => {
        const response = await subject().withAuth().send({
          ids: uuid,
        });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: [
            {
              title: 'Task 0',
              uuid: uuid[0],
              status: 'archived',
            },
            {
              title: 'Task 0',
              uuid: uuid[2],
              status: 'archived',
            },
            {
              title: 'Task 0',
              uuid: uuid[1],
              status: 'archived',
            },
          ],
        });
      });
    });
  });

  describe('Put /users/tasks/:id/complete', () => {
    const uuid = [
      '067176b2-baaf-4936-b7d4-6d202ab72639',
      'c185e0c2-842e-46f0-a1e8-41d598569431',
      '36b6ee02-e4c7-40c3-8df3-f7bf4f443183',
    ];
    const subject = () => request(server).put(`/bulk/tasks/complete`);
    it(...checkNoAuthBehavior(subject));

    it('complete task', async () => {
      await withCleanup(app, async () => {
        const response = await subject().withAuth().send({ ids: uuid });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: [
            {
              title: 'Task 0',
              uuid: uuid[0],
              status: 'completed',
            },
            {
              title: 'Task 0',
              uuid: uuid[2],
              status: 'completed',
            },
            {
              title: 'Task 0',
              uuid: uuid[1],
              status: 'completed',
            },
          ],
        });
      });
    });
  });

  describe('Put /users/tasks/:id/reopen', () => {
    const uuid = [
      '067176b2-baaf-4936-b7d4-6d202ab72639',
      'c185e0c2-842e-46f0-a1e8-41d598569431',
      '36b6ee02-e4c7-40c3-8df3-f7bf4f443183',
    ];
    const subject = () => request(server).put(`/bulk/tasks/reopen`);
    it(...checkNoAuthBehavior(subject));

    it('reopen task', async () => {
      await withCleanup(app, async () => {
        const response = await subject().withAuth().send({ ids: uuid });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: [
            {
              title: 'Task 0',
              uuid: uuid[0],
              status: 'scheduled',
            },
            {
              title: 'Task 0',
              uuid: uuid[2],
              status: 'scheduled',
            },
            {
              title: 'Task 0',
              uuid: uuid[1],
              status: 'scheduled',
            },
          ],
        });
      });
    });
  });

  afterAll(async () => {
    return await app.close();
  });
});
