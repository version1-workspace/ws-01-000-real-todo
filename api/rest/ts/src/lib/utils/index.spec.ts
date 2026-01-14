import { toMap } from './';

describe('toMap', () => {
  it(`array to map`, () => {
    expect(toMap([{ id: 1 }, { id: 1 }, { id: 2 }])).toEqual({
      1: [{ id: 1 }, { id: 1 }],
      2: [{ id: 2 }],
    });
  });
});
