"use client"
import { useMemo } from "react"
import Icon from "@/components/shared/icon"
import PopupMenu, { Action } from "@/components/shared/popupMenu"
import FilterForm from "@/components/tasks/filterForm"
import FilterStates from "@/components/tasks/list/header/filter-states"
import { Filter, Params } from "@/components/tasks/list/hooks/useFilter"
import useCheck from "@/contexts/check"
import useProjects from "@/contexts/projects"
import useTasks from "@/contexts/tasks"
import { useToast } from "@/lib/toast/hook"
import api from "@/services/api"
import styles from "./index.module.css"

interface Actions {
  onComplete: () => void
  onArchive: () => void
  onReopen: () => void
}

const headerControlIconSize = 14
const actionLogoIconSize = 14

const getActions = ({ onComplete, onArchive, onReopen }: Actions) =>
  (
    [
      {
        key: "reopen",
        logo: (
          <Icon name="undo" className={styles.logo} size={actionLogoIconSize} />
        ),
        text: "未完了にする",
        onClick: onReopen,
      },
      {
        key: "complete",
        logo: (
          <Icon
            name="complete"
            className={styles.logo}
            size={actionLogoIconSize}
          />
        ),
        text: "完了にする",
        onClick: onComplete,
      },
      {
        key: "archive",
        logo: (
          <Icon
            name="archive"
            className={styles.logo}
            size={actionLogoIconSize}
          />
        ),
        text: "アーカイブ",
        danger: true,
        onClick: onArchive,
      },
    ] as Action[]
  ).filter((it) => !it.hidden)

interface TaskListHeaderProps {
  filter: Filter
}

const TaskListHeader = ({ filter }: TaskListHeaderProps) => {
  const { ids: checkedIds } = useCheck()
  const { projects } = useProjects()
  const toast = useToast()
  const { original, isDateSet, replica, update, reset, resetState, save } =
    filter
  const { projectId } = original
  const { data, fetch } = useTasks()
  const project = useMemo(
    () => projects.find((it) => projectId === it.id),
    [projects, projectId],
  )

  if (!data) {
    return null
  }

  const showActionMenu = () => {}
  const resetField = (key: keyof Params) => {
    const params = resetState(key)
    fetch({ ...params, page: 1 })
  }

  return (
    <div className={styles.header}>
      <div className={styles.pageControl}>
        <div className={styles.leftPageControl}>
          <div className={styles.pageIndex}>
            <span>
              {data.page} / {data.pageCount}
            </span>
          </div>
          <div className={styles.pageCount}>
            <span className={styles.total}>{data.total} 件</span>
          </div>
        </div>
        <div className={styles.displayPageCount}>
          <label>表示件数 : </label>
          <select
            className={styles.select}
            onChange={(e) => {
              const limit = Number(e.target.value)
              const newValues = { ...replica, limit, page: 1 }
              update({ ...newValues })
              save(newValues)
              fetch({ ...newValues })
            }}
            value={replica.limit}
          >
            <option value="20">20 件</option>
            <option value="50">50 件</option>
            <option value="100">100 件</option>
          </select>
        </div>
      </div>
      <div className={styles.control}>
        <FilterStates
          date={original.date}
          isDateSet={isDateSet}
          order={original.order}
          projectName={project?.name}
          statuses={original.statuses}
          text={original.text}
          onReset={resetField}
        />
        <div className={styles.controller}>
          <FilterForm
            trigger={
              <div className={styles.display}>
                <Icon name="filter" size={headerControlIconSize} />
                <p>絞り込み</p>
              </div>
            }
            value={replica}
            onShow={() => {
              reset()
            }}
            onSubmit={async () => {
              const newValue = { ...replica, page: 1 }
              save(newValue)
              await fetch(newValue)
            }}
            onChange={update}
            onCancel={() => {
              reset()
            }}
          />
          <PopupMenu
            disabled={Object.keys(checkedIds).length === 0}
            actions={getActions({
              onComplete: async () => {
                if (!confirm("選択したタスクを完了しますがよろしいですか？")) {
                  return
                }

                try {
                  await api.bulkCompleteTask({ ids: checkedIds })
                  toast.success("選択したタスクを完了しました。")
                  const newValue = { ...replica, page: 1 }
                  save(newValue)
                  fetch(replica)
                } catch {
                  toast.error("タスクの完了に失敗しました。")
                }
              },
              onArchive: async () => {
                if (
                  !confirm("選択したタスクをアーカイブしますがよろしいですか？")
                ) {
                  return
                }

                try {
                  await api.bulkArchiveTask({ ids: checkedIds })
                  toast.success("選択したタスクをアーカイブしました。")
                  const newValue = { ...replica, page: 1 }
                  save(newValue)
                  fetch(newValue)
                } catch {
                  toast.error("タスクのアーカイブに失敗しました。")
                }
              },
              onReopen: async () => {
                if (
                  !confirm("選択したタスクを未完了にしますがよろしいですか？")
                ) {
                  return
                }

                try {
                  await api.bulkReopenTask({ ids: checkedIds })
                  toast.success("選択したタスクを未完了にしました。")
                  const newValue = { ...replica, page: 1 }
                  save(newValue)
                  fetch(newValue)
                } catch {
                  toast.error("タスクの未完了処理に失敗しました。")
                }
              },
            })}
            trigger={
              <div className={styles.action}>
                <Icon
                  name="menu"
                  size={headerControlIconSize}
                  onClick={showActionMenu}
                />
                <div>
                  <p onClick={showActionMenu}>アクション</p>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}

export default TaskListHeader
