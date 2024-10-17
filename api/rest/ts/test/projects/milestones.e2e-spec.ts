import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from 'typeorm';
import { withCleanup } from '../helper/databse';
import { checkNoAuthBehavior, prepareApp } from '../helper';
import request from '../helper/request';
import { Task } from '../../src/domains/tasks/task.entity';

const jwtService = { verifyAsync: () => ({ sub: 'user 1' }) };

describe('Projects/MilestonesController (e2e)', () => {
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

  describe('Get /projects/:slug/milestones', () => {
    const slug = 'programming';
    const subject = () => request(server).get(`/projects/${slug}/milestones`);

    it(...checkNoAuthBehavior(subject));

    it('page params, retrun expected list', async () => {
      const response = await subject().withAuth();
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        data: {
          milestones: expect.any(Array),
          orphans: [],
        },
      });
    });
  });

  describe('Put /projects/:slug/milestones/:id/archive', () => {
    const uuid = '67331996-7671-4cce-87a4-18b46adbd230';
    const slug = 'programming';
    const subject = () =>
      request(server).put(`/projects/${slug}/milestones/${uuid}/archive`);

    it(...checkNoAuthBehavior(subject));

    it('archive milestone', async () => {
      await withCleanup(app, async (em: EntityManager) => {
        await subject().withAuth().expect(200);

        const milestone = await em.findOne(Task, { where: { uuid } });
        expect(milestone).toMatchObject({
          uuid,
          status: 'archived',
        });
      });
    });
  });

  afterAll(async () => {
    return await app.close();
  });
});
