import supertest from 'supertest';

export class ExtendedTest {
  readonly _test: supertest.Test;

  constructor(test: supertest.Test) {
    this._test = test;
  }

  withAuth() {
    return this._test.set('Authorization', 'Bearer [token]');
  }
}

const handler = {
  get: (receiver: ExtendedTest, prop: keyof ExtendedTest) => {
    if (prop in receiver) {
      return receiver[prop];
    }

    return receiver._test[prop];
  },
};

export type Test = ExtendedTest & supertest.Test;

const testFactory = (test: supertest.Test): Test =>
  new Proxy(new ExtendedTest(test), handler) as Test;

class ExtendedRequest {
  _request: supertest.SuperTest<supertest.Test>;

  constructor(app: any) {
    this._request = supertest(app);
  }

  get(path: string) {
    return testFactory(this._request.get(path));
  }

  post(path: string) {
    return testFactory(this._request.post(path));
  }

  patch(path: string) {
    return testFactory(this._request.patch(path));
  }

  put(path: string) {
    return testFactory(this._request.put(path));
  }
}

export default function (app: any) {
  return new ExtendedRequest(app);
}
