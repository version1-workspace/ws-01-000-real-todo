import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { EntityManager } from 'typeorm';
import { Task } from '../../src/domains/tasks/task.entity';
import { checkNoAuthBehavior, prepareApp } from '../helper';
import { withCleanup } from '../helper/databse';
import request from '../helper/request';

const jwtService = { verifyAsync: () => ({ sub: 'user 1' }) };
const today = dayjs();

const projectId = '9a1b53d8-4afc-4630-a26e-3634a10bf619';

describe('TasksController (e2e)', () => {
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

  describe('Get /users/tasks', () => {
    const subject = () => request(server).get('/users/tasks');

    it(...checkNoAuthBehavior(subject));

    it('witout any query parasm, return empty list', async () => {
      const response = await subject().withAuth();
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        data: [],
        pageInfo: {
          hasNext: false,
          hasPrevious: false,
          limit: 20,
          page: 1,
          sortOrder: 'asc',
          sortType: 'deadline',
          totalCount: 0,
        },
      });
    });

    describe('with status', () => {
      it('fetched scheduled task, return tasks list', async () => {
        const response = await subject()
          .withAuth()
          .query({ 'status[]': ['scheduled'] });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 20,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 125,
          },
        });
      });

      it('fetched scheduled and completed task, return tasks list', async () => {
        const response = await subject()
          .withAuth()
          .query({ 'status[]': ['scheduled', 'completed'] });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 20,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 134,
          },
        });
      });

      it('fetched scheduled, completed and archived task, return tasks list', async () => {
        const response = await subject()
          .withAuth()
          .query({ 'status[]': ['scheduled', 'completed', 'archived'] });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 20,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 140,
          },
        });
      });
    });

    describe('with date params', () => {
      it('with full params, return expeceted tasks list', async () => {
        const response = await subject()
          .withAuth()
          .query({
            'status[]': ['scheduled'],
            dateFrom: today.add(1, 'year').add(-7, 'day').format('YYYY-MM-DD'),
            dateTo: today.add(1, 'year').format('YYYY-MM-DD'),
            dateType: 'deadline',
          });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: expect.any(Array),
          pageInfo: {
            hasNext: false,
            hasPrevious: false,
            limit: 20,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 18,
          },
        });
      });

      it('with only date from, return expeceted tasks list', async () => {
        const response = await subject()
          .withAuth()
          .query({
            'status[]': ['scheduled'],
            dateFrom: today.add(1, 'year').add(-7, 'day').format('YYYY-MM-DD'),
            dateType: 'deadline',
          });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 20,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 21,
          },
        });
      });

      it('with only date to, return expeceted tasks list', async () => {
        const response = await subject()
          .withAuth()
          .query({
            'status[]': ['scheduled'],
            dateTo: today.add(1, 'year').add(-7, 'day').format('YYYY-MM-DD'),
            dateType: 'deadline',
          });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 20,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 104,
          },
        });
      });
    });

    describe('with search params', () => {
      it('with search, return expeceted tasks list', async () => {
        const response = await subject()
          .withAuth()
          .query({
            'status[]': ['scheduled'],
            search: 'Task 1',
          });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 20,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 23,
          },
        });
      });
    });

    describe('with limit and page', () => {
      it('return expeceted tasks list', async () => {
        const page1 = await subject()
          .withAuth()
          .query({
            'status[]': ['scheduled'],
            limit: 50,
            page: 1,
          });
        expect(page1.status).toEqual(200);
        expect(page1.body).toMatchObject({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 50,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 125,
          },
        });

        const page2 = await subject()
          .withAuth()
          .query({
            'status[]': ['scheduled'],
            limit: 50,
            page: 2,
          });
        expect(page2.status).toEqual(200);
        expect(page2.body).toMatchObject({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: true,
            limit: 50,
            page: 2,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 125,
          },
        });

        const page3 = await subject()
          .withAuth()
          .query({
            'status[]': ['scheduled'],
            limit: 50,
            page: 3,
          });
        expect(page3.status).toEqual(200);
        expect(page3.body).toMatchObject({
          data: expect.any(Array),
          pageInfo: {
            hasNext: false,
            hasPrevious: true,
            limit: 50,
            page: 3,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 125,
          },
        });
      });
    });

    describe('with projectId', () => {
      it('return tasks only in the project', async () => {
        const response = await subject()
          .withAuth()
          .query({
            'status[]': ['scheduled'],
            projectId,
            limit: 20,
            page: 1,
          });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 20,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 95,
          },
        });
      });
    });

    describe('with sortOrder and sortType', () => {
      it('deadline, desc', async () => {
        const response = await subject()
          .withAuth()
          .query({
            'status[]': ['scheduled'],
            projectId,
            sortOrder: 'desc',
            limit: 3,
            page: 1,
          });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: [
            {
              id: expect.any(Number),
              title: 'Task 0',
            },
            {
              id: expect.any(Number),
              title: 'Task 1',
            },
            {
              id: expect.any(Number),
              title: 'Task 2',
            },
          ],
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 3,
            page: 1,
            sortOrder: 'desc',
            sortType: 'deadline',
            totalCount: 95,
          },
        });
      });

      it('createdAt, asc', async () => {
        const response = await subject()
          .withAuth()
          .query({
            'status[]': ['scheduled'],
            projectId,
            sortType: 'createdAt',
            limit: 3,
            page: 1,
          });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: [
            {
              id: expect.any(Number),
              title: 'Task 0',
            },
            {
              id: expect.any(Number),
              title: 'Task 1',
            },
            {
              id: expect.any(Number),
              title: 'Task 2',
            },
          ],
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 3,
            page: 1,
            sortOrder: 'asc',
            sortType: 'createdAt',
            totalCount: 95,
          },
        });
      });

      it('createdAt, desc', async () => {
        const response = await subject()
          .withAuth()
          .query({
            'status[]': ['scheduled'],
            projectId,
            sortOrder: 'desc',
            sortType: 'createdAt',
            limit: 3,
            page: 1,
          });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: [
            {
              id: expect.any(Number),
              title: 'Task 94',
            },
            {
              id: expect.any(Number),
              title: 'Task 93',
            },
            {
              id: expect.any(Number),
              title: 'Task 92',
            },
          ],
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 3,
            page: 1,
            sortOrder: 'desc',
            sortType: 'createdAt',
            totalCount: 95,
          },
        });
      });
    });
  });

  describe('Post /users/tasks', () => {
    const subject = () => request(server).post(`/users/tasks`);
    it(...checkNoAuthBehavior(subject));
    it('create task', async () => {
      await withCleanup(app, async (em: EntityManager) => {
        const before = await em.count(Task);
        await subject()
          .withAuth()
          .send({
            title: 'Task XXX',
            projectId,
            deadline: '2026-01-01',
            startingAt: undefined,
            status: 'scheduled',
            kind: 'task',
          })
          .expect(201);
        const after = await em.count(Task);
        expect(after - before).toEqual(1);
      });
    });
  });

  describe('Get /users/tasks/:id', () => {
    const uuid = '067176b2-baaf-4936-b7d4-6d202ab72639';
    const subject = () => request(server).get(`/users/tasks/${uuid}`);
    it(...checkNoAuthBehavior(subject));

    it('not found', () => {
      const uuid = '[not found uuid]';
      request(server).get(`/users/tasks/${uuid}`).expect(404);
    });

    it('fetch task', async () => {
      const response = await subject()
        .withAuth()
        .query({
          'status[]': ['scheduled'],
          projectId,
          sortOrder: 'desc',
          sortType: 'createdAt',
          limit: 3,
          page: 1,
        });
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        data: {
          id: expect.any(Number),
          uuid,
          status: 'scheduled',
        },
      });
    });
  });

  describe('Patch /users/tasks/:id', () => {
    const uuid = '067176b2-baaf-4936-b7d4-6d202ab72639';
    const subject = () => request(server).patch(`/users/tasks/${uuid}`);
    it(...checkNoAuthBehavior(subject));

    it('update task', async () => {
      await withCleanup(app, async () => {
        const response = await subject().withAuth().send({
          title: 'Updated',
          projectId: 'ee9f5f2e-fc8c-4830-985a-a44e96e96ffe',
          status: 'archived',
          deadline: '2022-01-01',
          finishedAt: '2022-01-01',
          startingAt: '2022-01-01',
        });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: {
            id: expect.any(Number),
            uuid,
            title: 'Updated',
            projectId: 2,
            status: 'archived',
            deadline: '2022-01-01',
            finishedAt: '2022-01-01',
            startingAt: '2022-01-01',
          },
        });
      });
    });
  });

  describe('Put /users/tasks/:id/archive', () => {
    const uuid = '067176b2-baaf-4936-b7d4-6d202ab72639';
    const subject = () => request(server).put(`/users/tasks/${uuid}/archive`);
    it(...checkNoAuthBehavior(subject));

    it('archive task', async () => {
      await withCleanup(app, async () => {
        const response = await subject().withAuth();
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: {
            id: expect.any(Number),
            title: 'Task 0',
            uuid,
            status: 'archived',
          },
        });
      });
    });
  });

  describe('Put /users/tasks/:id/complete', () => {
    const uuid = '067176b2-baaf-4936-b7d4-6d202ab72639';
    const subject = () => request(server).put(`/users/tasks/${uuid}/complete`);
    it(...checkNoAuthBehavior(subject));

    it('complete task', async () => {
      await withCleanup(app, async () => {
        const response = await subject().withAuth();
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: {
            id: expect.any(Number),
            title: 'Task 0',
            uuid,
            status: 'completed',
          },
        });
      });
    });
  });

  describe('Put /users/tasks/:id/reopen', () => {
    const uuid = '067176b2-baaf-4936-b7d4-6d202ab72639';
    const subject = () => request(server).put(`/users/tasks/${uuid}/reopen`);
    it(...checkNoAuthBehavior(subject));

    it('reopen task', async () => {
      await withCleanup(app, async () => {
        const response = await subject().withAuth();
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: {
            id: expect.any(Number),
            title: 'Task 0',
            uuid,
            status: 'scheduled',
          },
        });
      });
    });
  });

  afterAll(async () => {
    return await app.close();
  });
});
