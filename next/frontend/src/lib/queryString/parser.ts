const dig = (path: string, value: any): Record<string, any> => {
  if (!path) {
    return {};
  }

  const begin = path.lastIndexOf("[");
  const end = path.lastIndexOf("]");
  if (begin < 0 || end < 0) {
    return { [path]: value };
  }

  const key = path.slice(begin + 1, end);
  const prefix = path.slice(0, begin);
  const isNumericKey = !isNaN(Number(key));
  const isArray = isNumericKey || !key;
  if (prefix && isArray) {
    return dig(prefix, [value]);
  }

  if (prefix && !isArray) {
    return dig(prefix, { [key]: value });
  }

  return { [path]: value };
};

const deepMerge = (o1: any, o2: any) => {
  const base = JSON.parse(JSON.stringify(o1));
  Object.keys(o2).forEach((key) => {
    const value = o2[key];
    if (!base[key]) {
      base[key] = value;
      return;
    }

    if (Array.isArray(base[key]) && Array.isArray(value)) {
      base[key] = [...base[key], ...value];
      return;
    }

    if (typeof value === "object") {
      base[key] = deepMerge(base[key], value);
      return;
    }

    base[key] = value;
  });

  return base;
};

export const parse = (search: string) => {
  let obj = {};
  const list = search.split("&");
  list.forEach((it) => {
    const [key, value] = it.split("=");
    obj = deepMerge(obj, dig(key, value));
  });

  return obj;
};

