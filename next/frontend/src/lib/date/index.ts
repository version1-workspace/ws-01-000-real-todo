import dayjs from "dayjs";

export class AppDate {
  _raw: Date;
  static in(days: number) {
    const date = new AppDate();

    return date.add(days);
  }

  static now() {
    return new AppDate();
  }

  constructor(date?: Date) {
    this._raw = date || new Date();
  }

  private get date() {
    return dayjs(this._raw);
  }

  add(day: number) {
    const newDate = this.date.add(day, "day");

    return new AppDate(newDate.toDate());
  }

  toString() {
    return this.date.format("YYYY-MM-DD");
  }
}

export class AppDateTime {
  _raw: Date;
  static now() {
    new AppDateTime();
  }

  constructor(date?: Date) {
    this._raw = date || new Date();
  }

  private get date() {
    return dayjs(this._raw);
  }

  toString() {
    return this.date.format("YYYY-MM-DD HH:MM:SS");
  }
}
