import { useState } from "react"
import { classHelper } from "@/lib/cls"
import styles from "./index.module.css"

interface Props {
  onToggle?: (on: boolean) => void
}

export default function Switcher({ onToggle }: Props) {
  const [on, setOn] = useState(false)
  return (
    <div
      className={classHelper({
        [styles.container]: true,
        [styles.switchOn]: on,
        [styles.switchOff]: !on,
      })}
      onClick={() => {
        setOn((on) => {
          onToggle?.(!on)
          return !on
        })
      }}
    >
      <div
        className={classHelper({
          [styles.handle]: true,
          [styles.handleOn]: on,
          [styles.handleOff]: !on,
        })}
      ></div>
    </div>
  )
}
