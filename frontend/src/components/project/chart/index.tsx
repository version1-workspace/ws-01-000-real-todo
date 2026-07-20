"use client"
import type { ChartData } from "chart.js"
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import styles from "@/components/project/chart/index.module.css"
import ProjectMetricsCard from "@/components/project/chart/metrics-card"
import ChartUnitSelect, {
  ChartUnit,
  type ChartUnitType,
} from "@/components/project/chart/unit-select"
import api from "@/services/api"
import type { ProgressSummaryMetric, Stats } from "@/viewmodels/stats"
import { dataset, progressSummary } from "@/viewmodels/stats"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
)

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  datasets: {
    bar: {
      maxBarThickness: 40,
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: false,
    },
  },
}

const defaultDate = () => {
  const now = dayjs()
  const end = now.add(3, "day").format("YYYY-MM-DD")
  const start = now.subtract(3, "day").format("YYYY-MM-DD")

  return { start, end }
}

export default function Chart() {
  const [unit, setUnit] = useState<ChartUnitType>(ChartUnit.week)
  const [date, setDate] = useState(defaultDate)
  const [data, setData] = useState<ChartData<"bar"> | undefined>()
  const [stats, setStats] = useState<Stats[]>([])
  const [summary, setSummary] = useState<ProgressSummaryMetric[]>([])

  useEffect(() => {
    const init = async () => {
      const res = await api.fetchStats()
      const stats = res.data as Stats[]
      setStats(stats)
      setSummary(progressSummary(stats))
    }

    init()
  }, [])

  useEffect(() => {
    if (stats.length === 0) {
      return
    }

    setData(dataset(stats, unit) as ChartData<"bar">)
  }, [stats, unit])

  // TODO: implemt loader
  if (!data) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.header}>
          <h2 className={styles.title}>進捗サマリー</h2>
          <ChartUnitSelect value={unit} onChange={setUnit} />
        </div>
        <div className={styles.control}>
          <div className={styles.legend}>
            <ul className={styles.legendList}>
              <li>
                <span
                  className={styles.legendLabel}
                  style={{ backgroundColor: "#16a34a" }}
                ></span>
                完了タスク
              </li>
              <li>
                <span
                  className={styles.legendLabel}
                  style={{ backgroundColor: "#16a34a40" }}
                ></span>
                予定タスク
              </li>
            </ul>
          </div>
          <div className={styles.dateRange}>
            <input
              className={styles.input}
              type="date"
              value={date.start}
              onChange={(e) => setDate({ ...date, start: e.target.value })}
            />
            <span className={styles.slash}> ~ </span>
            <input
              className={styles.input}
              type="date"
              value={date.end}
              onChange={(e) => setDate({ ...date, end: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.chart}>
          <Bar options={options} data={data} />
        </div>
        <div className={styles.footer}>
          {summary.map((metric) => (
            <ProjectMetricsCard key={metric.label} metric={metric} />
          ))}
        </div>
      </div>
    </div>
  )
}
