import dayjs from 'dayjs';
import crypto from 'crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from '../src/config/env.js';
import { generateRefreshToken, hashPassword } from '../src/lib/password.js';

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

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

const main = async () => {
  await prisma.tagTask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const now = dayjs();
  const users = [];
  for (let i = 1; i <= 10; i += 1) {
    const createdAt = now.add(i, 'second').toDate();
    const user = await prisma.user.create({
      data: {
        uuid: userIds[i - 1],
        username: `user ${i}`,
        email: `user.${i}@example.com`,
        password: await hashPassword('AndyBobCharrie', createdAt),
        refreshToken: await generateRefreshToken(),
        status: 'active',
        createdAt,
        updatedAt: createdAt,
      },
    });
    users.push(user);
  }

  const user = users[0];

  const tags = [];
  for (const [index, tag] of [
    { name: 'インプット', status: 'enabled' },
    { name: 'アウトプット', status: 'enabled' },
    { name: '調査', status: 'enabled' },
  ].entries()) {
    const timestamp = now.add(index, 'minute').toDate();
    tags.push(
      await prisma.tag.create({
        data: {
          uuid: crypto.randomUUID(),
          name: tag.name,
          status: tag.status,
          userId: user.id,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      }),
    );
  }

  const baseProjects = [
    {
      userId: user.id,
      name: 'プログラミング',
      uuid: '9a1b53d8-4afc-4630-a26e-3634a10bf619',
      slug: 'programming',
      goal: '期限日までにフロントエンドエンジニアとして就職する。',
      shouldbe: 'エンジニアとしての学習習慣を身につけて生活する。',
      status: 'active',
    },
    {
      userId: user.id,
      name: '英語',
      uuid: 'ee9f5f2e-fc8c-4830-985a-a44e96e96ffe',
      slug: 'english',
      goal: 'IELTS Over All 7.0',
      shouldbe: '英語に浸る',
      status: 'active',
    },
    {
      userId: user.id,
      name: 'プライベート',
      uuid: '75cda72f-9883-4570-b3b5-66d389d5b1a9',
      slug: 'private',
      goal: '長期休みに海外旅行する',
      shouldbe: null,
      status: 'active',
    },
  ];

  const projects = [];
  for (const [index, project] of baseProjects.entries()) {
    const timestamp = now.add(index, 'hour').toDate();
    projects.push(
      await prisma.project.create({
        data: {
          ...project,
          deadline: dayjs().add(1, 'year').add(index, 'day').toDate(),
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      }),
    );
  }

  for (let index = 0; index < 17; index += 1) {
    const timestamp = now.add(index, 'day').toDate();
    projects.push(
      await prisma.project.create({
        data: {
          uuid: crypto.randomUUID(),
          userId: user.id,
          name: `ダミープロジェクト ${index + 1}`,
          slug: `dummy-project-${index + 1}`,
          goal: `ダミープロジェクト ${index + 1}`,
          shouldbe: null,
          status: index >= 14 ? 'archived' : 'active',
          deadline: dayjs().add(1, 'year').add(1, 'month').add(index, 'day').toDate(),
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      }),
    );
  }

  const taskPlans = [
    {
      project: projects[0],
      fixedTaskUuid: '067176b2-baaf-4936-b7d4-6d202ab72639',
      fixedMilestoneUuid: '67331996-7671-4cce-87a4-18b46adbd230',
      count: 100,
    },
    {
      project: projects[1],
      fixedTaskUuid: 'c185e0c2-842e-46f0-a1e8-41d598569431',
      fixedMilestoneUuid: 'be36a559-ec88-4817-b98e-c084a0d51616',
      count: 30,
    },
    {
      project: projects[2],
      fixedTaskUuid: '36b6ee02-e4c7-40c3-8df3-f7bf4f443183',
      fixedMilestoneUuid: crypto.randomUUID(),
      count: 10,
    },
  ];

  for (const plan of taskPlans) {
    const taskIds: number[] = [];
    const baseDate = dayjs().add(1, 'year');

    for (let index = 0; index < plan.count; index += 1) {
      let status = 'scheduled';
      if (index >= plan.count - 3) {
        status = 'archived';
      } else if (index >= plan.count - 6) {
        status = 'completed';
      }

      const timestamp = now.add(index, 'second').toDate();
      const task = await prisma.task.create({
        data: {
          uuid: index === 0 ? plan.fixedTaskUuid : crypto.randomUUID(),
          title: `Task ${index}`,
          userId: user.id,
          projectId: plan.project.id,
          kind: 'task',
          status,
          deadline: baseDate.add(-index, 'day').toDate(),
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });
      taskIds.push(task.id);
    }

    let head = 0;
    for (let milestoneIndex = 0; milestoneIndex < 5; milestoneIndex += 1) {
      const tail = head + Math.ceil((taskIds.length - head) / 2);
      const children = taskIds.slice(head, tail);
      const childTasks = await prisma.task.findMany({
        where: { id: { in: children } },
        orderBy: { id: 'asc' },
      });
      const deadline =
        childTasks.length > 0
          ? childTasks[childTasks.length - 1].deadline
          : plan.project.deadline;

      const timestamp = now.add(milestoneIndex, 'month').toDate();
      const milestone = await prisma.task.create({
        data: {
          uuid:
            milestoneIndex === 0
              ? plan.fixedMilestoneUuid
              : crypto.randomUUID(),
          title: `milestone ${milestoneIndex}`,
          userId: user.id,
          projectId: plan.project.id,
          kind: 'milestone',
          status: 'scheduled',
          deadline,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      await prisma.task.updateMany({
        where: { id: { in: children } },
        data: { parentId: milestone.id },
      });

      head = tail;
    }
  }

  const firstProjectTasks = await prisma.task.findMany({
    where: {
      projectId: projects[0].id,
      kind: 'task',
    },
    orderBy: { id: 'asc' },
    take: 3,
  });

  for (const [index, task] of firstProjectTasks.entries()) {
    await prisma.tagTask.create({
      data: {
        tagId: tags[index % tags.length].id,
        taskId: task.id,
        createdAt: now.add(index, 'week').toDate(),
        updatedAt: now.add(index, 'week').toDate(),
      },
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
