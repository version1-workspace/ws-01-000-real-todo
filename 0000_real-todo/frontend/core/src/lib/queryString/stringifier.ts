const getPath = (obj: Object | any[], context = "", prefix = "") => {
  let path = prefix;
  let result = obj;
  Object.keys(obj).some((key) => {
    const value = obj[key];
    if (Array.isArray(value)) {
      if (value.length === 0) {
        path = prefix + key;
        result = value;
        delete obj[key];
        return true;
      }
      [path, result] = getPath(value, "array", prefix + key);
      return true;
    }

    if (typeof value === "object") {
      if (!value || Object.keys(value).length === 0) {
        path = prefix ? prefix + `[${key}]` : key;
        result = value;
        if (Array.isArray(obj)) {
          obj.shift();
        } else {
          delete obj[key];
        }
        return true;
      }
      [path, result] = getPath(
        value,
        "object",
        prefix ? prefix + `[${key}]` : key,
      );

      return true;
    }

    result = value;

    if (context === "object") {
      path = prefix + `[${key}]`;
      delete obj[key];
      return true;
    } else if (context === "array" && Array.isArray(obj)) {
      path = prefix + `[]`;
      obj.shift();
      return true;
    } else {
      path = prefix + key;
      delete obj[key];
      return true;
    }
  });

  return [path, result];
};

export const stringify = (obj: any) => {
  const base = JSON.parse(JSON.stringify(obj));
  let [path, value] = getPath(base);
  if (!path) {
    return "";
  }

  let str = presence(value) ? path + "=" + value : "";
  while (path) {
    [path, value] = getPath(base);
    if (presence(value)) {
      str = (str.length > 0 ? str + "&" : "") + path + "=" + value;
    }
  }

  return str;
};

const presence = (value: any) => {
  return value && (!isNaN(Number(value)) || Object.keys(value).length > 0);
};
