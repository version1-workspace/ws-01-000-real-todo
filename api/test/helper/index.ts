import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test as NestTest } from '@nestjs/testing';
import { dataSourceOptions } from '../../src/db/config';
import appConfig from '../../src/config/app.config';
import { AppModule } from '../../src/app.module';
import { Test } from './request';

export const checkNoAuthBehavior = (test: () => Test): [string, () => Test] => [
  'no auth token, return 401',
  () => {
    return test().expect(401);
  },
];

interface OverrideProvier {
  provider: any;
  value: any;
}

export const prepareApp = async (providers: OverrideProvier[]) => {
  let moduleFixture = NestTest.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [appConfig],
        envFilePath: ['.env.test'],
        isGlobal: true,
      }),
      TypeOrmModule.forRoot(dataSourceOptions as any),
      AppModule,
    ],
  });

  providers.forEach((it) => {
    moduleFixture = moduleFixture
      .overrideProvider(it.provider)
      .useValue(it.value);
  });

  const module = await moduleFixture.compile();
  const app = module.createNestApplication();
  await app.init();

  return app;
};
