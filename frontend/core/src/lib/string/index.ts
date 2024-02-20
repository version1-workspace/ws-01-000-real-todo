export const truncate = (
  value: string,
  length: number,
  suffix: string = "...",
) => {
  if (value.length <= length) {
    return value
  }

  return value.slice(0, length) + " " + suffix;
};
