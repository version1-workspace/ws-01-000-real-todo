import { EntityManager, DeepPartial } from 'typeorm';
import dayjs from 'dayjs';
import { UsersService } from '../../../users/users.service';
import { User } from '../../../users/user.entity';
import { Project } from '../../../projects/project.entity';
import { Task } from '../../../tasks/task.entity';

export const seed = async ({ app, dataSource, logger }) => {
  const usersService = app.get(UsersService);
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

    console.log('projects ========');
    const user = users[0];
    const projects = [];
    await Promise.all(
      [
        {
          userId: user.id,
          name: 'プログラミング',
          deadline: dayjs('2024/08/12').toDate(),
          slug: 'programming',
          goal: '期限日までにフロントエンドエンジニアとして就職する。',
          shouldbe: 'エンジニアとしての学習習慣を身につけて生活する。',
          status: 'active' as 'active',
        },
        {
          userId: user.id,
          name: '英語',
          deadline: dayjs('2024/08/12').toDate(),
          slug: 'english',
          goal: 'IELTS Over All 7.0',
          shouldbe: '英語に浸る',
          status: 'active' as 'active',
        },
        {
          userId: user.id,
          name: 'プライベート',
          deadline: dayjs('2024/08/12').toDate(),
          slug: 'private',
          goal: '長期休みに海外旅行する',
          status: 'active' as 'active',
        },
      ].map(async (it: DeepPartial<Project>) => {
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
          deadline: dayjs('2024/08/12').toDate(),
          title: 'プログラミング',
          status: 'scheduled' as 'scheduled',
        },
      ].map(async (it: DeepPartial<Task>) => {
        const task = manager.create(Task, it);
        await manager.save(task);

        tasks.push(task);
      }),
    );
  });
};
