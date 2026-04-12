const translations = {
  ja: {
    task: {
      status: {
        scheduled: "未完了",
        completed: "完了",
        archived: "アーカイブ済み",
      },
      order: {
        asc: "昇順",
        desc: "降順",
      },
      deadline: "締切日時",
      createdAt: "作成日時",
      updatedAt: "更新日時",
    },
  },
};

class Translate {
  defaultNamespace: string;
  translations: { [key: string]: any };

  constructor(translations: { [key: string]: any }, namespace: string) {
    this.defaultNamespace = namespace;
    this.translations = translations;
  }

  derive(namespace: string) {
    const res = find(
      this.translations,
      [this.defaultNamespace, namespace].join("."),
    );
    if (typeof res !== "object") {
      return;
    }

    return new Translate(res, "");
  }

  t(str: string) {
    const namespace = this.defaultNamespace
      ? [this.defaultNamespace, str].join(".")
      : str;
    return find(this.translations, namespace);
  }
}

const find = (obj: { [key: string]: any }, str: string): string => {
  let search = str;
  const delimited = str.split(".");
  if (delimited.length > 1) {
    search = delimited[0];
  }

  const value = obj[search];
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }
  delimited.shift();

  if (!delimited[0]) {
    return value;
  }

  return find(value, delimited.join("."));
};

export const ja = new Translate(translations, "ja");
