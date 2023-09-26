import { AppDataSource } from '../config';
import { User } from '../../users/user.entity';
import { v4 as uuid } from 'uuid';

const seed = async () => {
  const conn = await AppDataSource.initialize();
  console.log('connection is establised');
  await conn.transaction(async (manager) => {
    return await Promise.all(
      new Array(10).fill('').map(async (_, index) => {
        console.log(`seeding for user. index: ${index}`);
        await manager.insert(User, {
          uuid: uuid(),
          username: `user ${index}`,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }),
    );
  });
};

seed();
