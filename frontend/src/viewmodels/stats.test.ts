import { describe, expect, it } from "vitest"
import {
  ProgressSummaryChangeDirection,
  ProgressSummaryKind,
  progressSummary,
  Stats,
} from "@/viewmodels/stats"

const stats = [
  {
    label: "完了タスク",
    type: "completed",
    data: [
      { date: 1, value: 10 },
      { date: 2, value: 10 },
      { date: 3, value: 20 },
      { date: 4, value: 20 },
    ],
  },
  {
    label: "予定タスク",
    type: "todo",
    data: [
      { date: 1, value: 30 },
      { date: 2, value: 30 },
      { date: 3, value: 30 },
      { date: 4, value: 30 },
    ],
  },
] as Stats[]

describe("progressSummary", () => {
  it("タスク数と完了率をサマリーカード用の表示値に変換する", () => {
    expect(progressSummary(stats)).toEqual([
      {
        label: "完了タスク",
        value: "60",
        change: "+100%",
        changeDirection: ProgressSummaryChangeDirection.up,
        kind: ProgressSummaryKind.count,
      },
      {
        label: "予定タスク",
        value: "120",
        change: "0%",
        changeDirection: ProgressSummaryChangeDirection.flat,
        kind: ProgressSummaryKind.count,
      },
      {
        label: "完了率",
        value: "33%",
        change: "+100%",
        changeDirection: ProgressSummaryChangeDirection.up,
        kind: ProgressSummaryKind.rate,
      },
    ])
  })
})
