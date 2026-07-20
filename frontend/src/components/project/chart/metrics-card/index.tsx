import type { CSSProperties } from "react"
import {
  ProgressSummaryKind,
  type ProgressSummaryMetric,
} from "@/viewmodels/stats"
import styles from "./index.module.css"

interface Props {
  metric: ProgressSummaryMetric
}

export default function ProjectMetricsCard({ metric }: Props) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{metric.label}</p>
      <div className={styles.body}>
        {metric.kind === ProgressSummaryKind.rate ? (
          <div
            className={styles.rate}
            style={{ "--rate": metric.value } as CSSProperties}
            aria-label={`${metric.label} ${metric.value}`}
          >
            <span>{metric.value}</span>
          </div>
        ) : (
          <span className={styles.value}>{metric.value}</span>
        )}
        <div className={`${styles.change} ${styles[metric.changeDirection]}`}>
          <span className={styles.changeValue}>{metric.change}</span>
          <span className={styles.changeLabel}>前週比</span>
        </div>
      </div>
    </div>
  )
}
