export const classHelper = (obj: { [key: string]: boolean | undefined }) =>
  Object.keys(obj).reduce((acc, key) => {
    if (obj[key]) {
      return acc + " " + key;
    }

    return acc;
  }, "");

export const join = (...args: string[]) => {
  return args.join(" ");
};
