import * as bcrypt from 'bcrypt';

export const hash = async (
  base: string,
  sugar: string,
  stretching: number = 5,
) => {
  const str = [base, sugar].join('_');
  return bcrypt.hash(str, stretching);
};
