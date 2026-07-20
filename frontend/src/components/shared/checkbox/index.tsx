import { Check } from "lucide-react"
import { useState } from "react"
import { classHelper } from "@/lib/cls"
import styles from "./index.module.css"

interface Props {
  label: string
  defaultValue: boolean
  onClick: (checked: boolean) => void
}

export default function Checkbox({ label, defaultValue, onClick }: Props) {
  const [checked, setChecked] = useState(defaultValue)

  return (
    <div className={styles.container}>
      <label
        className={styles.label}
        htmlFor={label}
        onClick={() => {
          const next = !checked
          setChecked(next)
          onClick(next)
        }}
      >
        <div
          className={classHelper({
            [styles.box]: true,
            [styles.checked]: checked,
          })}
        >
          {checked ? <Check className={styles.check} color="white" /> : null}
        </div>
        <p>{label}</p>
      </label>
    </div>
  )
}
