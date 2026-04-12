import dayjs from "dayjs";

export default class DateDecorator {
  readonly _raw?: string;
  readonly _date?: dayjs.Dayjs;
  _calcFromCache: Record<string, number> = {};

  constructor(params: string) {
    if (params) {
      this._raw = params;
      this._date = dayjs(this._raw);
    }
  }

  toString() {
    return this._raw;
  }

  get date() {
    return this._date;
  }

  get forHtml() {
    return this.date?.format("YYYY-MM-DD");
  }

  humanize() {
    return this._raw;
  }

  format() {
    return this.date?.format("YYYY/MM/DD");
  }

  year() {
    return this.date?.year();
  }

  month() {
    return this.date?.month();
  }

  day() {
    return this.date?.day();
  }

  from(time = dayjs()) {
    if (!this.date) {
      return;
    }

    let base = time;
    let i = 0;
    while (!this.date.isSame(base, "day") && !this.date.isBefore(base, "day")) {
      base = base.add(1, "day");
      i++;
      if (i >= 500) {
        break;
      }
    }

    return i;
  }

  greaterThanEqual(d: DateDecorator) {
    return this.date?.isAfter(d.date) || this.date?.isSame(d.date, "day");
  }

  lessThanEqual(d: DateDecorator) {
    return this.date?.isBefore(d.date) || this.date?.isSame(d.date, "day");
  }
}

export const now = () => new DateDecorator(dayjs().format("YYYY-MM-DD"));
