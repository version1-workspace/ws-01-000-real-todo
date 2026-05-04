"use client"
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
import { SetStateAction, useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import { IoBarChart as BarChart } from "react-icons/io5"
import styles from "@/components/project/chart/index.module.css"
import Option from "@/components/shared/option"
import Select from "@/components/shared/select"
import api from "@/services/api"
import { dataset } from "@/viewmodels/stats"

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

const Unit = {
  year: "year",
  month: "month",
  week: "week",
  day: "day",
}

const groupOptions = [
  { label: "年", value: Unit.year },
  { label: "月", value: Unit.month },
  { label: "週", value: Unit.week },
  { label: "日", value: Unit.day },
]

const ChartType = {
  bar: "bar" as const,
}

const defaultDate = () => {
  const now = dayjs()
  const end = now.add(3, "day").format("YYYY-MM-DD")
  const start = now.subtract(3, "day").format("YYYY-MM-DD")

  return { start, end }
}

export default function Chart() {
  const [unit, setUnit] = useState(Unit.day)
  const [date, setDate] = useState(defaultDate)
  const [data, setData] = useState([])

  useEffect(() => {
    const init = async () => {
      const res = await api.fetchStats()
      const data = dataset(res.data, unit)
      setData(data as any)
    }

    init()
  }, [])

  // TODO: implemt loader
  if (data.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.body}>
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
          <div className={styles.group}>
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
          <Bar options={options} data={data as any} />
        </div>
        <div className={styles.footer}></div>
      </div>
    </div>
  )
}
