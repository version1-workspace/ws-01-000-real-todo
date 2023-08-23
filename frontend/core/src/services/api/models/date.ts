import dayjs from 'dayjs'

export default class DateDecorator {
  readonly _raw: string
  readonly _date: dayjs.Dayjs

  constructor(params: string) {
    this._raw = params
    this._date = dayjs(this._raw)
  }

  toString() {
    return this._raw
  }

  get date() {
    return this._date
  }

  humanize() {
    return this._raw
  }

  format() {
    return this.date.format('YYYY/MM/DD')
  }

  year() {
    return this.date.year()
  }

  month() {
    return this.date.month()
  }

  day() {
    return this.date.day()
  }
}
