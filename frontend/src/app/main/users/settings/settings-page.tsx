"use client"

import { useState } from "react"
import Button from "@/components/shared/button"
import Select from "@/components/shared/select"
import UsersLayout from "@/components/users/layout"
import useProjects from "@/contexts/projects"
import { useNotice, useUnimplementedPage } from "@/hooks/useNotice"
import { classHelper } from "@/lib/cls"
import styles from "./page.module.css"

const colors = [
  "var(--primary-color)",
  "var(--danger-color)",
  "#D9E76C",
  "var(--info-color)",
  "var(--warn-color)",
]

const onOffOptions = [
  { label: "ON", value: "on" },
  { label: "OFF", value: "off" },
]

export default function SettingsPage() {
  const [colorIndex, setColorIndex] = useState(0)
  const { projects } = useProjects()
  const { unimplementedFunc } = useNotice()
  useUnimplementedPage()

  return (
    <UsersLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.pageTitle}>設定</h2>
            <p className={styles.pageDescription}>
              表示と通知に関する設定をまとめて管理します。
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.title}>表示設定</h3>
              <p className={styles.description}>画面の見た目を調整します。</p>
            </div>
            <div className={styles.settingRows}>
              <div className={styles.settingRow}>
                <div>
                  <p className={styles.label}>テーマカラー</p>
                  <p className={styles.helpText}>アプリ全体のアクセント色</p>
                </div>
                <ul className={styles.paletteList}>
                  {colors.map((color, index) => (
                    <li
                      key={color}
                      className={classHelper({
                        [styles.paletteItem]: true,
                        [styles.paletteItemActive]: index === colorIndex,
                      })}
                      onClick={() => setColorIndex(index)}
                      role="button"
                      aria-label={`テーマカラー ${index + 1}`}
                      aria-pressed={index === colorIndex}
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          setColorIndex(index)
                        }
                      }}
                    >
                      <div
                        className={styles.color}
                        style={{ background: color }}
                      ></div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.settingRow}>
                <div>
                  <p className={styles.label}>サイドバー</p>
                  <p className={styles.helpText}>メニューの表示位置</p>
                </div>
                <div className={styles.selectControl}>
                  <Select
                    data={[
                      {
                        label: "左",
                        value: "left",
                      },
                      {
                        label: "右",
                        value: "right",
                      },
                    ]}
                    defaultOption={{ label: "左", value: "left" }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.title}>通知設定</h3>
              <p className={styles.description}>
                お知らせとプロジェクト期限の通知を管理します。
              </p>
            </div>
            <div className={styles.settingRows}>
              <div className={styles.settingRow}>
                <div>
                  <p className={styles.label}>お知らせ</p>
                  <p className={styles.helpText}>サービスからの通知</p>
                </div>
                <div className={styles.selectControl}>
                  <Select data={onOffOptions} defaultOption={onOffOptions[0]} />
                </div>
              </div>
              <div className={styles.alertGroup}>
                <div className={styles.groupHeader}>
                  <h4 className={styles.groupTitle}>期限日アラート</h4>
                  <div className={styles.border}></div>
                </div>
                <div className={styles.alerts}>
                  {projects.map((it) => (
                    <div className={styles.settingRow} key={it.id}>
                      <div>
                        <p className={styles.label}>{it.name}</p>
                        <p className={styles.helpText}>期限前の通知</p>
                      </div>
                      <div className={styles.selectControl}>
                        <Select
                          data={onOffOptions}
                          defaultOption={onOffOptions[0]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className={styles.footer}>
          <div className={styles.action}>
            <Button variant="primary" onClick={unimplementedFunc}>
              更新
            </Button>
            <Button>キャンセル</Button>
          </div>
        </div>
      </div>
    </UsersLayout>
  )
}
