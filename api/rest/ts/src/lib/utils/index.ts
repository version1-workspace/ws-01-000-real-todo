import * as bcrypt from 'bcrypt';

export const hash = async (
  base: string,
  sugar: string,
  stretching: number = 5,
) => {
  const str = [base, sugar].join('_');
  return bcrypt.hash(str, stretching);
};

export const toMap = <T extends { id: string | number }>(array: T[]) => {
  return array.reduce((acc: Record<string, T[]>, it: T) => {
    return {
      ...acc,
      [it.id]: [...(acc[it.id] || []), it],
    };
  }, {});
};
