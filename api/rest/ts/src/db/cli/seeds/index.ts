import { EntityManager, DeepPartial } from 'typeorm';
import dayjs from 'dayjs';
import { UsersService } from '../../../domains/users/users.service';
import { User } from '../../../domains/users/user.entity';
import { Project, StatusType } from '../../../domains/projects/project.entity';
import { Task } from '../../../domains/tasks/task.entity';
import { Tag } from '../../../domains/tags/tag.entity';

export const seed = async ({ appFactory, dataSource, logger }) => {
  const app = await appFactory();
  const usersService = app.get(UsersService);
  const now = dayjs();
  logger.info('connection is establised');

  const users = [];
  const userIds = [
    'fa66f863-1040-48bd-a156-11bb7cce796e',
    '4e5eb084-0499-47f8-a0d9-79603002e1bd',
    '95bab443-1fda-4d63-90ca-2e13296650af',
    '0060f247-3223-4512-9ce1-6bfaa18a2579',
    '4195c4df-47fd-4b1b-b952-c7c38aa8f27f',
    'f4d43b04-998d-4fcc-9afc-0dcbd0a5673a',
    '1fe031c0-bf34-4684-ae29-baa9cf242398',
    '03129556-4243-4c68-bdc5-b71c0cb129a3',
    'c45beb14-3b18-4841-b1cc-ba6a84ac3067',
    '9be550a1-7d6f-4488-af0d-a60989e90d3a',
  ];
  await dataSource.transaction(async (manager: EntityManager) => {
    logger.info('[START] users ========');
    for (let i = 1; i <= 10; i++) {
      const timestamp = new Date();
      const user = manager.create(User, {
        username: `user ${i}`,
        email: `user.${i}@example.com`,
        uuid: userIds[i - 1],
        createdAt: timestamp,
        updatedAt: timestamp,
        status: 'active',
      });
      user.password = await usersService.hash(user, 'AndyBobCharrie');
      user.refreshToken = await usersService.hashRefreshToken();

      await manager.save(user);
      users.push(user);
    }
    logger.info('[END]', 'count:', users.length);

    logger.info('[START] tags ========');
    const user = users[0];
    const tags = [];
    await Promise.all(
      [
        {
          name: 'インプット',
          userId: user.id,
          status: 'enabled' as const,
        },
        {
          name: 'アウトプット',
          userId: user.id,
          status: 'enabled' as const,
        },
        {
          name: '調査',
          userId: user.id,
          status: 'enabled' as const,
        },
      ].map(async (it: DeepPartial<Tag>, index: number) => {
        const timestamp = now.add(index, 'second').toDate();
        it.createdAt = timestamp;
        it.updatedAt = timestamp;

        const tag = manager.create(Tag, it);
        await manager.save(tag);

        tags.push(tag);
      }),
    );
    logger.info('[END]', 'count:', tags.length);

    logger.info('[START] projects ========');
    const projects = [];
    await Promise.all(
      [
        {
          userId: user.id,
          name: 'プログラミング',
          uuid: '9a1b53d8-4afc-4630-a26e-3634a10bf619',
          slug: 'programming',
          goal: '期限日までにフロントエンドエンジニアとして就職する。',
          shouldbe: 'エンジニアとしての学習習慣を身につけて生活する。',
          status: 'active' as const,
        },
        {
          userId: user.id,
          name: '英語',
          uuid: 'ee9f5f2e-fc8c-4830-985a-a44e96e96ffe',
          slug: 'english',
          goal: 'IELTS Over All 7.0',
          shouldbe: '英語に浸る',
          status: 'active' as const,
        },
        {
          userId: user.id,
          name: 'プライベート',
          uuid: '75cda72f-9883-4570-b3b5-66d389d5b1a9',
          slug: 'private',
          goal: '長期休みに海外旅行する',
          status: 'active' as const,
        },
      ].map(async (it: DeepPartial<Project>, index: number) => {
        it.deadline = dayjs().add(1, 'year').add(index, 'day').toDate();
        const timestamp = now.add(index, 'second').toDate();
        it.createdAt = timestamp;
        it.updatedAt = timestamp;

        const project = manager.create(Project, it);
        await manager.save(project);

        projects.push(project);
      }),
    );
    Promise.all(
      new Array(20 - projects.length).fill('').map(async (_, index) => {
        let status: StatusType = 'active' as const;
        if (index >= 14) {
          status = 'archived' as const;
        }

        const it: DeepPartial<Project> = {
          userId: user.id,
          name: `ダミープロジェクト ${index + 1}`,
          slug: `dummy-projec-${index + 1}`,
          goal: `ダミープロジェクト ${index + 1}`,
          status,
        };

        it.deadline = dayjs()
          .add(1, 'year')
          .add(1, 'month')
          .add(index, 'day')
          .toDate();
        const timestamp = now.add(index, 'second').toDate();
        it.createdAt = timestamp;
        it.updatedAt = timestamp;

        const project = manager.create(Project, it);
        await manager.save(project);

        projects.push(project);
      }),
    );
    logger.info('[END]', 'count:', projects.length);

    logger.info('[START] tasks ========');
    const args = [
      {
        project: projects[0],
        premadeTasks: [
          {
            userId: user.id,
            projectId: projects[0].id,
            uuid: '067176b2-baaf-4936-b7d4-6d202ab72639',
            kind: 'task',
            status: 'scheduled',
          },
        ],
        premadeMilestones: [
          {
            userId: user.id,
            uuid: '67331996-7671-4cce-87a4-18b46adbd230',
            projectId: projects[0].id,
            title: `milestone 0`,
            kind: 'milestone' as const,
            status: 'scheduled' as const,
          },
        ],
        tasks: [],
        count: 100,
        baseDate: dayjs().add(1, 'year'),
      },
      {
        project: projects[1],
        premadeTasks: [
          {
            userId: user.id,
            projectId: projects[1].id,
            uuid: 'c185e0c2-842e-46f0-a1e8-41d598569431',
            kind: 'task',
            status: 'scheduled',
          },
        ],
        premadeMilestones: [
          {
            userId: user.id,
            uuid: 'be36a559-ec88-4817-b98e-c084a0d51616',
            projectId: projects[1].id,
            title: `milestone 0`,
            kind: 'milestone' as const,
            status: 'scheduled' as const,
          },
        ],
        tasks: [],
        count: 30,
        baseDate: dayjs().add(1, 'year'),
      },
      {
        project: projects[2],
        premadeTasks: [
          {
            userId: user.id,
            uuid: '36b6ee02-e4c7-40c3-8df3-f7bf4f443183',
            projectId: projects[2].id,
            kind: 'task',
            status: 'scheduled',
          },
        ],
        premadeMilestones: [
          {
            userId: user.id,
            projectId: projects[2].id,
            title: `milestone 0`,
            kind: 'milestone' as const,
            status: 'scheduled' as const,
          },
        ],
        tasks: [],
        count: 10,
        baseDate: dayjs().add(1, 'year'),
      },
    ];

    await Promise.all(
      args.map(async (arg) => {
        const { project, premadeTasks, tasks, count, baseDate } = arg;
        premadeTasks.forEach((it) => tasks.push(it));

        const _count = count - premadeTasks.length;
        for (let i = 0; i < _count; i++) {
          let status = 'scheduled';
          if (i >= arg.count - 3) {
            status = 'archived';
          } else if (i >= arg.count - 6) {
            status = 'completed';
          }

          tasks.push({
            userId: user.id,
            projectId: project.id,
            kind: 'task' as const,
            status,
          });
        }

        await Promise.all(
          tasks.map(async (it: DeepPartial<Task>, index: number) => {
            it.title = `Task ${index.toString()}`;
            it.deadline = baseDate.add(-index, 'day').toDate();
            const timestamp = now.add(index, 'second').toDate();
            it.createdAt = timestamp;
            it.updatedAt = timestamp;

            const task = manager.create(Task, it);
            await manager.save(task);
            tasks[index].id = task.id;
          }),
        );

        let head = 0;
        for (let i = 0; i < 5; i++) {
          const milestone =
            i === 0
              ? arg.premadeMilestones[0]
              : {
                  userId: user.id,
                  projectId: project.id,
                  title: `milestone ${i}`,
                  kind: 'milestone' as const,
                  status: 'scheduled' as const,
                };

          const m = manager.create(Task, milestone);
          const tail = head + Math.ceil((tasks.length - 1 - head) / 2);
          m.children = tasks.slice(head, tail);

          if (m.children.length > 0) {
            m.deadline = m.children.slice(-1)[0].deadline;
          } else {
            m.deadline = project.deadline;
          }

          await manager.save(m);
          head = tail;
        }
      }),
    );
    const allTaskCount = args.reduce((acc, it) => {
      return acc + it.tasks.length;
    }, 0);
    logger.info('[END]', 'count:', allTaskCount);
  });
};
