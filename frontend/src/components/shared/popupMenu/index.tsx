"use client"
import { useEffect, useState } from "react"
import { classHelper } from "@/lib/cls"
import styles from "./index.module.css"

interface Props {
  disabled?: boolean
  trigger: React.ReactNode
  actions: Action[]
  header?: React.ReactNode
  align?: "left" | "right"
}

export interface Action {
  key: string
  logo: React.ReactNode
  text: string
  danger?: boolean
  hidden?: boolean
  divider?: boolean
  onClick: () => void
}

export default function PopupMenu({
  disabled,
  trigger,
  actions,
  header,
  align = "right",
}: Props) {
  const [show, setShow] = useState(false)
  const visibleActions = actions.filter((item) => !item.hidden)

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const ele = e.target as HTMLElement
      const parent = ele?.closest("." + styles.container)
      if (!parent) {
        setShow(false)
      }
    }
    document.body.addEventListener("click", listener)

    return () => {
      document.body.removeEventListener("click", listener)
    }
  }, [show])

  return (
    <div
      className={classHelper({
        [styles.container]: true,
        [styles.disabled]: disabled,
      })}
    >
      <div
        onClick={(e) => {
          e.stopPropagation()
          if (disabled) {
            return
          }
          setShow(true)
        }}
      >
        {trigger}
      </div>
      {show ? (
        <div
          className={classHelper({
            [styles.popupMenu]: true,
            [styles.alignLeft]: align === "left",
            [styles.alignRight]: align === "right",
          })}
        >
          {header ? <div className={styles.header}>{header}</div> : null}
          <ul className={styles.content}>
            {visibleActions.map((it) => {
              return (
                <li key={it.key}>
                  <button
                    className={classHelper({
                      [styles.action]: true,
                      [styles.danger]: it.danger,
                      [styles.divider]: it.divider,
                    })}
                    type="button"
                    onClick={() => {
                      it.onClick()
                      setShow(false)
                    }}
                  >
                    <span className={styles.logo}>{it.logo}</span>
                    <span className={styles.text}>{it.text}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
