export interface Stat {
  total: number;
  kinds: {
    milestone: number;
    task: number;
  };
  states: {
    scheduled: number;
    completed: number;
    archived: number;
  };
}

export const init = () =>
  ({
    total: 0,
    kinds: {
      milestone: 0,
      task: 0,
    },
    states: {
      scheduled: 0,
      completed: 0,
      archived: 0,
    },
  }) as Stat;
