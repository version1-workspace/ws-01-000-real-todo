import { EntityManager, DeepPartial } from 'typeorm';
import dayjs from 'dayjs';
import { UsersService } from '../../../domains/users/users.service';
import { User } from '../../../domains/users/user.entity';
import { Project } from '../../../domains/projects/project.entity';
import { Task } from '../../../domains/tasks/task.entity';
import { Tag } from '../../../domains/tags/tag.entity';

export const seed = async ({ app, dataSource, logger }) => {
  const usersService = app.get(UsersService);
  const now = dayjs();
  console.log('connection is establised');

  console.log('users ========');
  const users = [];
  await dataSource.transaction(async (manager: EntityManager) => {
    for (let i = 1; i <= 10; i++) {
      logger.info(`seeding for a user. index: ${i}`);
      const timestamp = new Date();
      const user = manager.create(User, {
        username: `user ${i}`,
        email: `user.${i}@example.com`,
        createdAt: timestamp,
        updatedAt: timestamp,
        status: 'active',
      });
      user.password = await usersService.hash(user, 'password');
      user.refreshToken = await usersService.hashRefreshToken();

      await manager.save(user);
      users.push(user);
    }

    console.log('tags ========');
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

    console.log('projects ========');
    const projects = [];
    await Promise.all(
      [
        {
          userId: user.id,
          name: 'プログラミング',
          slug: 'programming',
          goal: '期限日までにフロントエンドエンジニアとして就職する。',
          shouldbe: 'エンジニアとしての学習習慣を身につけて生活する。',
          status: 'active' as 'active',
        },
        {
          userId: user.id,
          name: '英語',
          slug: 'english',
          goal: 'IELTS Over All 7.0',
          shouldbe: '英語に浸る',
          status: 'active' as 'active',
        },
        {
          userId: user.id,
          name: 'プライベート',
          slug: 'private',
          goal: '長期休みに海外旅行する',
          status: 'active' as 'active',
        },
      ].map(async (it: DeepPartial<Project>, index: number) => {
        const day = (30 - index).toString().padStart(2, '0');
        it.deadline = dayjs(`2024/08/${day}`).toDate();
        const timestamp = now.add(index, 'second').toDate();
        it.createdAt = timestamp;
        it.updatedAt = timestamp;

        const project = manager.create(Project, it);
        await manager.save(project);

        projects.push(project);
      }),
    );

    console.log('tasks ========');
    const project = projects[0];
    const tasks = [];
    await Promise.all(
      [
        {
          userId: user.id,
          projectId: project.id,
          status: 'scheduled' as 'scheduled',
        },
        {
          userId: user.id,
          projectId: project.id,
          status: 'scheduled' as 'scheduled',
        },
        {
          userId: user.id,
          projectId: project.id,
          status: 'scheduled' as 'scheduled',
        },
        {
          userId: user.id,
          projectId: project.id,
          status: 'scheduled' as 'scheduled',
        },
        {
          userId: user.id,
          projectId: project.id,
          deadline: dayjs('2024/08/12').toDate(),
          title: 'タスク ',
          status: 'scheduled' as 'scheduled',
        },
      ].map(async (it: DeepPartial<Task>, index: number) => {
        it.title = `Task ${index.toString()}`;
        const day = (30 - index).toString().padStart(2, '0');
        it.deadline = dayjs(`2024/08/${day}`).toDate();
        const timestamp = now.add(index, 'second').toDate();
        it.createdAt = timestamp;
        it.updatedAt = timestamp;

        const task = manager.create(Task, it);
        await manager.save(task);

        tasks.push(task);
      }),
    );

  });
};
