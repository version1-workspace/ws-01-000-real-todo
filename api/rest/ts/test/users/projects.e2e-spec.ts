import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { EntityManager } from 'typeorm';
import { Project } from '../../src/domains/projects/project.entity';
import { withCleanup } from '../helper/databse';
import { checkNoAuthBehavior, prepareApp } from '../helper';
import request from '../helper/request';

const jwtService = { verifyAsync: () => ({ sub: 'user 1' }) };

describe('ProjectsController (e2e)', () => {
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

  describe('Get /users/projects', () => {
    const subject = () => request(server).get('/users/projects');

    it(...checkNoAuthBehavior(subject));

    describe('data', () => {
      it('expected list', async () => {
        const response = await subject()
          .withAuth()
          .query({
            status: ['active'],
            limit: 3,
          });
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
          data: [
            {
              archivedAt: null,
              uuid: '9a1b53d8-4afc-4630-a26e-3634a10bf619',
              createdAt: expect.any(String),
              deadline: expect.any(String),
              finishedAt: null,
              goal: '期限日までにフロントエンドエンジニアとして就職する。',
              id: 1,
              milestones: [],
              name: 'プログラミング',
              slug: 'programming',
              startedAt: null,
              startingAt: null,
              stats: {
                kinds: {
                  milestone: 5,
                  task: 100,
                },
                states: {
                  archived: 2,
                  completed: 3,
                  scheduled: 100,
                },
                total: 105,
              },
              status: 'active',
              userId: 1,
            },
            {
              name: '英語',
              slug: 'english',
              goal: 'IELTS Over All 7.0',
              id: 2,
              uuid: 'ee9f5f2e-fc8c-4830-985a-a44e96e96ffe',
              milestones: [],
              stats: {
                kinds: {
                  milestone: 5,
                  task: 30,
                },
                states: {
                  archived: 2,
                  completed: 3,
                  scheduled: 30,
                },
                total: 35,
              },
              userId: 1,
              status: 'active',
            },
            {
              goal: '長期休みに海外旅行する',
              id: 3,
              uuid: '75cda72f-9883-4570-b3b5-66d389d5b1a9',
              name: 'プライベート',
              slug: 'private',
              stats: {
                kinds: {
                  milestone: 5,
                  task: 10,
                },
                states: {
                  archived: 2,
                  completed: 3,
                  scheduled: 10,
                },
                total: 15,
              },
              status: 'active',
              userId: 1,
            },
          ],
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 3,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 17,
          },
        });
      });
    });

    describe('status', () => {
      it('status is active', async () => {
        const r1 = await subject()
          .withAuth()
          .query({
            status: ['active'],
          });
        expect(r1.status).toEqual(200);
        expect(r1.body).toEqual({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 5,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 17,
          },
        });
      });

      it('status is archived', async () => {
        const r1 = await subject()
          .withAuth()
          .query({
            status: ['archived'],
          });
        expect(r1.status).toEqual(200);
        expect(r1.body).toEqual({
          data: expect.any(Array),
          pageInfo: {
            hasNext: false,
            hasPrevious: false,
            limit: 5,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 3,
          },
        });
      });

      it('status is active and archived', async () => {
        const r1 = await subject()
          .withAuth()
          .query({
            status: ['archived', 'active'],
          });
        expect(r1.status).toEqual(200);
        expect(r1.body).toEqual({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 5,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 20,
          },
        });
      });
    });

    describe('pagination', () => {
      it('page params, retrun expected list', async () => {
        const r1 = await subject().withAuth().query({
          limit: 6,
        });
        expect(r1.status).toEqual(200);
        expect(r1.body).toEqual({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: false,
            limit: 6,
            page: 1,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 17,
          },
        });

        const r2 = await subject().withAuth().query({
          limit: 6,
          page: 2,
        });
        expect(r2.status).toEqual(200);
        expect(r2.body).toEqual({
          data: expect.any(Array),
          pageInfo: {
            hasNext: true,
            hasPrevious: true,
            limit: 6,
            page: 2,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 17,
          },
        });

        const r3 = await subject().withAuth().query({
          limit: 6,
          page: 3,
        });
        expect(r3.status).toEqual(200);
        expect(r3.body).toEqual({
          data: expect.any(Array),
          pageInfo: {
            hasNext: false,
            hasPrevious: true,
            limit: 6,
            page: 3,
            sortOrder: 'asc',
            sortType: 'deadline',
            totalCount: 17,
          },
        });
      });
    });
  });

  describe('Post /users/projects', () => {
    const subject = () => request(server).post('/users/projects');

    it(...checkNoAuthBehavior(subject));
    it('created project normally', async () => {
      await withCleanup(app, async (em: EntityManager) => {
        const before = await em.count(Project);
        await subject()
          .withAuth()
          .send({
            userId: 1,
            name: 'テスト',
            slug: 'test',
            goal: 'Goal',
            shouldbe: 'Should Be',
            status: 'active' as const,
            deadline: dayjs().add(1, 'year').add(3, 'day').format('YYYY-MM-DD'),
            milestones: [
              {
                title: 'Test Milestone 1',
                deadline: dayjs()
                  .add(1, 'year')
                  .add(1, 'day')
                  .format('YYYY-MM-DD'),
              },
              {
                title: 'Test Milestone 2',
                deadline: dayjs()
                  .add(1, 'year')
                  .add(2, 'day')
                  .format('YYYY-MM-DD'),
              },
              {
                title: 'Test Milestone 3',
                deadline: dayjs()
                  .add(1, 'year')
                  .add(3, 'day')
                  .format('YYYY-MM-DD'),
              },
            ],
          })
          .expect(201);
        const after = await em.count(Project);

        expect(after - before).toEqual(1);
      });
    });
  });

  describe('Get /users/projects/:slug', () => {
    const slug = 'programming';
    const subject = () => request(server).get(`/users/projects/${slug}`);

    it(...checkNoAuthBehavior(subject));

    it('get project', async () => {
      const response = await subject().withAuth();
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        data: {
          userId: 1,
          name: 'プログラミング',
          uuid: '9a1b53d8-4afc-4630-a26e-3634a10bf619',
          slug,
          milestones: [],
        },
      });
    });
  });

  describe('Patch /users/tasks/:slug', () => {
    const slug = 'programming';
    const subject = () => request(server).patch(`/users/projects/${slug}`);

    it(...checkNoAuthBehavior(subject));

    it('update project', async () => {
      await withCleanup(app, async (em: EntityManager) => {
        await subject()
          .withAuth()
          .send({
            name: 'Test Project',
            slug: 'test',
            deadline: '2022-02-02',
            goal: 'Test Goal',
            shouldbe: 'Test Should Be',
          })
          .expect(200);
        const project = await em.findOne(Project, { where: { slug: 'test' } });
        expect(project).toMatchObject({
          name: 'Test Project',
          slug: 'test',
          deadline: dayjs('2022-02-02').toDate(),
          goal: 'Test Goal',
          shouldbe: 'Test Should Be',
        });
      });
    });
  });

  describe('Patch /users/tasks/:slug/archive', () => {
    const slug = 'programming';
    const subject = () =>
      request(server).patch(`/users/projects/${slug}/archive`);

    it('archive project', async () => {
      await withCleanup(app, async (em: EntityManager) => {
        await subject().withAuth().expect(200);
        const project = await em.findOne(Project, { where: { slug } });
        expect(project).toMatchObject({
          status: 'archived',
        });
      });
    });
  });
  describe('Patch /users/tasks/:slug/reopen', () => {
    const slug = 'programming';
    const subject = () =>
      request(server).patch(`/users/projects/${slug}/reopen`);

    it('reopen project', async () => {
      await withCleanup(app, async (em: EntityManager) => {
        await subject().withAuth().expect(200);
        const project = await em.findOne(Project, { where: { slug } });
        expect(project).toMatchObject({
          status: 'active',
        });
      });
    });
  });

  afterAll(async () => {
    return await app.close();
  });
});
