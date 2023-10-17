import { UsersService } from '../../../users/users.service';

export const seed = async ({ app, dataSource, logger }) => {
  const usersService = app.get(UsersService);
  console.log('connection is establised');
  await dataSource.transaction(async () => {
    for (let i = 1; i <= 10; i++) {
      logger.info(`seeding for a user. index: ${i}`);
      await usersService.signup(
        `user ${i}`,
        `user.${i}@example.com`,
        'password',
      );
    }
  });
};
