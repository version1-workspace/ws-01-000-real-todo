export const getColors = function (len: number = 10) {
  const list = [];
  for (let i = 0; i < len; i++) {
    const code = ((i + 1) * 140) % 760;
    const r = Math.max(code - 510, 0);
    const g = Math.min(Math.max(code - 255, 0), 255);
    const b = Math.min(255, code);
    list.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
  }

  return list;
};
