import { User } from '../../../users/user.entity';

export const seed = async ({ dataSource, logger }) => {
  console.log('connection is establised');
  await dataSource.transaction(async (manager) => {
    return await Promise.all(
      new Array(10).fill('').map(async (_, index) => {
        logger.info(`seeding for a user. index: ${index + 1}`);
        await manager.insert(User, {
          username: `user ${index + 1}`,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }),
    );
  });
};
