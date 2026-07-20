import styles from "./index.module.css"

export interface StepItem {
  label: string
}

interface Props {
  index: number
  steps: StepItem[]
}

export default function Steps({ index, steps }: Props) {
  const progress =
    steps.length <= 1 ? 0 : Math.round((index / (steps.length - 1)) * 100)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.bar}>
          <div className={styles.barContent}>
            <span
              className={styles.barProgress}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <ul className={styles.steps}>
          {steps.map((it, number) => {
            const state =
              number === index
                ? styles.current
                : number < index
                  ? styles.completed
                  : styles.pending

            return (
              <li key={it.label} className={`${styles.step} ${state}`}>
                <div className={styles.item}>
                  <div className={styles.circle}>
                    <span>{number + 1}</span>
                  </div>
                  <p className={styles.text}>{it.label}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
