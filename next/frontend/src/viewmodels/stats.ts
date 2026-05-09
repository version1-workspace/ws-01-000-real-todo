import dayjs from "dayjs"

export const StatsType = {
  todo: "todo",
  completed: "completed",
} as const

export const ProgressSummaryChangeDirection = {
  up: "up",
  down: "down",
  flat: "flat",
} as const

export const ProgressSummaryKind = {
  count: "count",
  rate: "rate",
} as const

export interface StatsParams {
  label: string
  type: keyof typeof StatsType
  data: Data[]
}

interface Data {
  date: number
  value: number
}

export class StatsModel {
  readonly _raw: StatsParams

  constructor(params: StatsParams) {
    this._raw = params
  }

  labels(unit: string) {
    if (!this._raw) {
      return []
    }

    const dataset = this._raw
    switch (unit) {
      case "year":
        return dataset.data.map((item) => dayjs(item.date).format("YYYY"))
      case "month":
        return dataset.data.map((item) => dayjs(item.date).format("YYYY / MM"))
      case "week":
        return dataset.data.map(
          (item) => dayjs(item.date).format("MM-DD") + " ~ ",
        )
      case "day":
        return dataset.data.map((item) => dayjs(item.date).format("M / DD"))
      default:
        return dataset.data.map((item) => dayjs(item.date).format("YYYY-MM-DD"))
    }
  }
}

const chartOptions: Record<
  keyof typeof StatsType,
  {
    borderColor: string
    backgroundColor: string
    stack: string
  }
> = {
  completed: {
    borderColor: "#16a34a",
    backgroundColor: "#16a34a",
    stack: "stack-0",
  },
  todo: {
    borderColor: "#16a34a40",
    backgroundColor: "#16a34a40",
    stack: "stack-0",
  },
}

export const dataset = (data: Stats[], unit: string) => {
  if (data.length === 0) {
    return []
  }

  return {
    labels: data[0].labels(unit),
    datasets: data.map((item) => {
      return {
        label: item.label,
        data: item.data.map((it) => it.value),
        ...chartOptions[item.type],
      }
    }),
  }
}

export type ProgressSummaryMetric = {
  label: string
  value: string
  change: string
  changeDirection: keyof typeof ProgressSummaryChangeDirection
  kind: keyof typeof ProgressSummaryKind
}

const sumValues = (data: Data[]) => {
  return data.reduce((total, item) => total + item.value, 0)
}

const trend = (data: Data[]) => {
  if (data.length < 2) {
    return 0
  }

  const midpoint = Math.ceil(data.length / 2)
  const previous = sumValues(data.slice(0, midpoint))
  const current = sumValues(data.slice(midpoint))

  if (previous === 0) {
    return current > 0 ? 100 : 0
  }

  return Math.round(((current - previous) / previous) * 100)
}

const formatChange = (change: number) => {
  if (change > 0) {
    return `+${change}%`
  }

  return `${change}%`
}

const direction = (
  change: number,
): ProgressSummaryMetric["changeDirection"] => {
  if (change > 0) {
    return ProgressSummaryChangeDirection.up
  }
  if (change < 0) {
    return ProgressSummaryChangeDirection.down
  }
  return ProgressSummaryChangeDirection.flat
}

const metricFor = (
  stats: Stats[],
  type: keyof typeof StatsType,
): ProgressSummaryMetric => {
  const item = stats.find((stat) => stat.type === type)
  const change = item ? trend(item.data) : 0

  return {
    label: type === StatsType.completed ? "完了タスク" : "予定タスク",
    value: String(item ? sumValues(item.data) : 0),
    change: formatChange(change),
    changeDirection: direction(change),
    kind: ProgressSummaryKind.count,
  }
}

export const progressSummary = (stats: Stats[]): ProgressSummaryMetric[] => {
  const completed = stats.find((stat) => stat.type === StatsType.completed)
  const todo = stats.find((stat) => stat.type === StatsType.todo)
  const completedTotal = completed ? sumValues(completed.data) : 0
  const todoTotal = todo ? sumValues(todo.data) : 0
  const total = completedTotal + todoTotal
  const completionRate =
    total === 0 ? 0 : Math.round((completedTotal / total) * 100)

  const rateChange =
    (completed ? trend(completed.data) : 0) - (todo ? trend(todo.data) : 0)

  return [
    metricFor(stats, StatsType.completed),
    metricFor(stats, StatsType.todo),
    {
      label: "完了率",
      value: `${completionRate}%`,
      change: formatChange(rateChange),
      changeDirection: direction(rateChange),
      kind: ProgressSummaryKind.rate,
    },
  ]
}

export type Stats = StatsParams & StatsModel
