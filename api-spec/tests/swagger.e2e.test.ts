import { beforeAll, describe, expect, it } from 'vitest';
import { assertResponseMatchesSpec } from './support/openapi.js';
import { request } from './support/http.js';

const fixtures = {
  userUuid: 'fa66f863-1040-48bd-a156-11bb7cce796e',
  taskUuid: '067176b2-baaf-4936-b7d4-6d202ab72639',
  projectUuid: '9a1b53d8-4afc-4630-a26e-3634a10bf619',
  projectSlug: 'programming',
  milestoneUuid: '67331996-7671-4cce-87a4-18b46adbd230',
  bulkTaskIds: [
    '067176b2-baaf-4936-b7d4-6d202ab72639',
    'c185e0c2-842e-46f0-a1e8-41d598569431',
    '36b6ee02-e4c7-40c3-8df3-f7bf4f443183',
  ],
};

describe.sequential('swagger.yaml E2E', () => {
  let accessToken = '';
  let refreshCookie = '';
  let createdTaskId = '';
  let createdProjectSlug = '';

  beforeAll(async () => {
    const response = await request({
      path: '/auth/login',
      method: 'POST',
      body: {
        email: 'user.1@example.com',
        password: 'AndyBobCharrie',
        rememberMe: true,
      },
    });

    expect(response.status).toBe(200);
    accessToken = response.json.data.accessToken;
    refreshCookie = response.headers.get('set-cookie')?.split(';')[0] ?? '';

    await assertResponseMatchesSpec({
      pathKey: '/auth/login',
      method: 'post',
      status: 200,
      body: response.json,
    });
  });

  it('GET /', async () => {
    const response = await request({ path: '/' });

    expect(response.status).toBe(200);
    await assertResponseMatchesSpec({
      pathKey: '/',
      method: 'get',
      status: 200,
      body: response.json,
    });
  });

  it('POST /auth/login 401', async () => {
    const response = await request({
      path: '/auth/login',
      method: 'POST',
      body: {
        email: 'user.1@example.com',
        password: 'wrong-password',
      },
    });

    expect(response.status).toBe(401);
    await assertResponseMatchesSpec({
      pathKey: '/auth/login',
      method: 'post',
      status: 401,
      body: response.json,
    });
  });

  it('POST /auth/refresh 200', async () => {
    const response = await request({
      path: '/auth/refresh',
      method: 'POST',
      cookie: refreshCookie,
      body: {
        uuid: fixtures.userUuid,
      },
    });

    expect(response.status).toBe(200);
    await assertResponseMatchesSpec({
      pathKey: '/auth/refresh',
      method: 'post',
      status: 200,
      body: response.json,
    });
  });

  it('POST /auth/refresh 401', async () => {
    const response = await request({
      path: '/auth/refresh',
      method: 'POST',
      cookie: 'refreshToken=wrong',
      body: {
        uuid: fixtures.userUuid,
      },
    });

    expect(response.status).toBe(401);
    await assertResponseMatchesSpec({
      pathKey: '/auth/refresh',
      method: 'post',
      status: 401,
      body: response.json,
    });
  });

  it('DELETE /auth/refresh 200', async () => {
    const response = await request({
      path: '/auth/refresh',
      method: 'DELETE',
    });

    expect(response.status).toBe(200);
  });

  it('GET /users/me 200', async () => {
    const response = await request({
      path: '/users/me',
      token: accessToken,
    });

    expect(response.status).toBe(200);
    await assertResponseMatchesSpec({
      pathKey: '/users/me',
      method: 'get',
      status: 200,
      body: response.json,
    });
  });

  it('GET /users/me 401', async () => {
    const response = await request({
      path: '/users/me',
    });

    expect(response.status).toBe(401);
    await assertResponseMatchesSpec({
      pathKey: '/users/me',
      method: 'get',
      status: 401,
      body: response.json,
    });
  });

  it('GET /users/tasks 200', async () => {
    const response = await request({
      path: `/users/tasks?status%5B%5D=scheduled&projectId=${fixtures.projectUuid}&limit=3&page=1`,
      token: accessToken,
    });

    expect(response.status).toBe(200);
    await assertResponseMatchesSpec({
      pathKey: '/users/tasks',
      method: 'get',
      status: 200,
      body: response.json,
    });
  });

  it('POST /users/tasks 201', async () => {
    const response = await request({
      path: '/users/tasks',
      method: 'POST',
      token: accessToken,
      body: {
        title: `Swagger Task ${Date.now()}`,
        projectId: fixtures.projectUuid,
        deadline: '2027-01-01',
        status: 'scheduled',
        kind: 'task',
      },
    });

    expect(response.status).toBe(201);
    createdTaskId = response.json.data[0].uuid;
    await assertResponseMatchesSpec({
      pathKey: '/users/tasks',
      method: 'post',
      status: 201,
      body: response.json,
    });
  });

  it('GET /users/tasks/{id} 200', async () => {
    const response = await request({
      path: `/users/tasks/${fixtures.taskUuid}`,
      token: accessToken,
    });

    expect(response.status).toBe(200);
    await assertResponseMatchesSpec({
      pathKey: '/users/tasks/{id}',
      method: 'get',
      status: 200,
      body: response.json,
    });
  });

  it('PATCH /users/tasks/{id} 200', async () => {
    const response = await request({
      path: `/users/tasks/${createdTaskId}`,
      method: 'PATCH',
      token: accessToken,
      body: {
        title: 'Updated Swagger Task',
        finishedAt: '2027-01-02T00:00:00.000Z',
        status: 'completed',
      },
    });

    expect(response.status).toBe(200);
    await assertResponseMatchesSpec({
      pathKey: '/users/tasks/{id}',
      method: 'patch',
      status: 200,
      body: response.json,
    });
  });

  it('PUT task status endpoints 200', async () => {
    for (const path of [
      `/users/tasks/${createdTaskId}/archive`,
      `/users/tasks/${createdTaskId}/complete`,
      `/users/tasks/${createdTaskId}/reopen`,
    ]) {
      const response = await request({
        path,
        method: 'PUT',
        token: accessToken,
      });

      expect(response.status).toBe(200);
    }
  });

  it('PUT bulk task status endpoints 200', async () => {
    for (const pathKey of ['/bulk/tasks/archive', '/bulk/tasks/complete', '/bulk/tasks/reopen'] as const) {
      const response = await request({
        path: pathKey,
        method: 'PUT',
        token: accessToken,
        body: {
          ids: fixtures.bulkTaskIds,
        },
      });

      expect(response.status).toBe(200);
      await assertResponseMatchesSpec({
        pathKey,
        method: 'put',
        status: 200,
        body: response.json,
      });
    }
  });

  it('GET /users/projects 200', async () => {
    const response = await request({
      path: '/users/projects?status=active&limit=3&page=1',
      token: accessToken,
    });

    expect(response.status).toBe(200);
    await assertResponseMatchesSpec({
      pathKey: '/users/projects',
      method: 'get',
      status: 200,
      body: response.json,
    });
  });

  it('POST /users/projects 201', async () => {
    createdProjectSlug = `swagger-project-${Date.now()}`;
    const response = await request({
      path: '/users/projects',
      method: 'POST',
      token: accessToken,
      body: {
        name: 'Swagger Project',
        deadline: '2027-02-01',
        status: 'active',
        slug: createdProjectSlug,
        goal: 'Goal',
        shouldbe: 'Should be',
        milestones: [
          {
            title: 'Milestone 1',
            deadline: '2027-01-15',
          },
        ],
      },
    });

    expect(response.status).toBe(201);
  });

  it('GET /users/projects/{slug} 200', async () => {
    const response = await request({
      path: `/users/projects/${fixtures.projectSlug}`,
      token: accessToken,
    });

    expect(response.status).toBe(200);
    await assertResponseMatchesSpec({
      pathKey: '/users/projects/{slug}',
      method: 'get',
      status: 200,
      body: response.json,
    });
  });

  it('PATCH project endpoints 200', async () => {
    const update = await request({
      path: `/users/projects/${createdProjectSlug}`,
      method: 'PATCH',
      token: accessToken,
      body: {
        name: 'Updated Swagger Project',
        deadline: '2027-02-10',
        slug: `${createdProjectSlug}-updated`,
        goal: 'Updated Goal',
        shouldbe: 'Updated Should be',
      },
    });
    expect(update.status).toBe(200);
    createdProjectSlug = `${createdProjectSlug}-updated`;

    for (const path of [
      `/users/projects/${createdProjectSlug}/archive`,
      `/users/projects/${createdProjectSlug}/reopen`,
    ]) {
      const response = await request({
        path,
        method: 'PATCH',
        token: accessToken,
      });

      expect(response.status).toBe(200);
    }
  });

  it('GET /users/tags 200', async () => {
    const response = await request({
      path: '/users/tags?status%5B%5D=enabled',
      token: accessToken,
    });

    expect(response.status).toBe(200);
    await assertResponseMatchesSpec({
      pathKey: '/users/tags',
      method: 'get',
      status: 200,
      body: response.json,
    });
  });

  it('GET /projects/{slug}/milestones 200', async () => {
    const response = await request({
      path: `/projects/${fixtures.projectSlug}/milestones`,
      token: accessToken,
    });

    expect(response.status).toBe(200);
    await assertResponseMatchesSpec({
      pathKey: '/projects/{slug}/milestones',
      method: 'get',
      status: 200,
      body: response.json,
    });
  });

  it('PUT /projects/{slug}/milestones/{id}/archive 200', async () => {
    const response = await request({
      path: `/projects/${fixtures.projectSlug}/milestones/${fixtures.milestoneUuid}/archive`,
      method: 'PUT',
      token: accessToken,
    });

    expect(response.status).toBe(200);
    await assertResponseMatchesSpec({
      pathKey: '/projects/{slug}/milestones/{id}/archive',
      method: 'put',
      status: 200,
      body: response.json,
    });
  });
});
