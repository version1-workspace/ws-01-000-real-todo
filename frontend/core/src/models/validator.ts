export type Errors = { [key: string]: string };

const commonValidators = {
  required: (label: string, value: any) => {
    if (value && value.toString().length > 0) {
      return;
    }

    return `${label}を入力して下さい`;
  },
  alphanumeric: (label: string, value: any) => {
    const date = value.toString();
    const regexp = /^[0-9a-zA-z].+$/;
    if (date.match(regexp)) {
      return;
    }

    return `${label} は 英数字 で入力して下さい`;
  },
  date: (label: string, value: any) => {
    const date = value.toString();
    const regexp = /^[0-9]{4}[\-][01][0-9][\-][0-3][0-9]$/;
    if (date.match(regexp)) {
      return;
    }

    return `${label} は YYYY-MM-DD 形式で入力してください`;
  },
};

type ValidateKey = keyof typeof commonValidators;

type ValidateFunc<T> = (data: T) => string | undefined;

type KeySet<T> = {
  [key: string]: {
    label: string;
    validator: (ValidateKey | ValidateFunc<T>)[];
  };
};

export default class Validator<T> {
  private _errors: Errors;
  private _keySet: KeySet<T>;

  constructor(keySet: KeySet<T>, errors?: Errors) {
    this._keySet = keySet;
    this._errors = errors || {};
  }

  get valid() {
    return Object.keys(this._errors).length === 0;
  }

  get errors() {
    return this._errors;
  }

  validate(data: T) {
    let res: Validator<T> = this.reset();

    Object.keys(this._keySet).forEach((key: string) => {
      const value = data[key as keyof T];
      const obj = this._keySet[key];

      obj.validator.every((it: ValidateKey | ValidateFunc<T>) => {
        let result: string | undefined;
        if (typeof it === "string") {
          const validate = commonValidators[it];
          result = validate(obj.label, value);
        }

        if (typeof it === "function") {
          result = it(data);
        }

        if (result) {
          res = this.with(key, result);
          return false;
        }

        return true;
      });
    });

    return res;
  }

  with(key: string, error: string) {
    this._errors[key] = error;

    return new Validator(this._keySet, {
      ...this._errors,
      [key]: error,
    });
  }

  private reset() {
    return new Validator<T>(this._keySet);
  }
}
