import Link from "next/link"
import { useState } from "react"
import EditableField from "@/components/shared/editableField"
import Icon from "@/components/shared/icon"
import Select, { OptionItem } from "@/components/shared/select"
import useCheck from "@/contexts/check"
import { classHelper, join } from "@/lib/cls"
import route from "@/lib/route"
import api from "@/services/api"
import { statusOptions, Task } from "@/viewmodels/task"
import styles from "./index.module.css"

interface Props {
  data: Task[]
  checkable?: boolean
}

const TaskTable = ({ data, checkable = true }: Props) => {
  const { check, checkAll, checked, allChecked } = useCheck()
  const ids = data.map((it) => it.id)

  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <div
          className={classHelper({
            [styles.tableHeaderCell]: true,
            [styles.checkCell]: true,
          })}
        >
          {checkable ? (
            <div
              className={classHelper({
                [styles.check]: true,
                [styles.unchecked]: !allChecked,
                [styles.checked]: allChecked,
              })}
            >
              <Icon
                className={styles.checkIcon}
                name="checkOutline"
                onClick={() => checkAll(ids)}
              />
            </div>
          ) : null}
        </div>
        <div className={join(styles.tableHeaderCell, styles.title)}>タスク</div>
        <div className={join(styles.tableHeaderCell, styles.project)}>
          プロジェクト
        </div>
        <div className={join(styles.tableHeaderCell, styles.statusHeader)}>
          ステータス
        </div>
        <div className={styles.tableHeaderCell}>期限日</div>
        <div className={styles.tableHeaderCell}>着手予定日</div>
        <div className={styles.tableHeaderCell}>完了日</div>
        <div className={join(styles.tableHeaderCell, styles.detail)}></div>
      </div>
      <div className={styles.tableBody}>
        {data.length === 0 ? (
          <div className={styles.tableRow}>
            <td>タスクが登録されていません</td>
          </div>
        ) : null}
        {data.map((it) => {
          return (
            <Row
              checkable={checkable}
              key={it.id}
              data={it}
              checked={checked[it.id]}
              onCheck={() => {
                check(it.id)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

interface SelectorProxyProps {
  options: OptionItem[]
  defaultValue: string
  defaultOption: OptionItem
  onSelect: (option: OptionItem) => void
}

const SelectorProxy = ({
  options,
  defaultValue,
  defaultOption,
  onSelect,
}: SelectorProxyProps) => {
  const [value, setValue] = useState(defaultValue)

  return (
    <Select
      data={options}
      value={value}
      defaultOption={defaultOption}
      onSelect={(option) => {
        setValue(option.value)
        onSelect(option)
      }}
      containerStyleClass={styles.selector}
      textStyleClass={styles.selectorText}
      flat
    />
  )
}

interface RowProps {
  data: Task
  checkable?: boolean
  checked?: boolean
  onCheck?: () => void
}

const Row = ({ data, checkable, checked, onCheck }: RowProps) => {
  return (
    <div key={data.id} className={styles.tableRow}>
      <div
        className={classHelper({
          [styles.tableCell]: true,
          [styles.checkCell]: true,
        })}
      >
        {checkable ? (
          <div
            className={classHelper({
              [styles.check]: true,
              [styles.unchecked]: !checked,
              [styles.checked]: checked,
            })}
          >
            <Icon
              className={styles.checkIcon}
              name="checkOutline"
              onClick={onCheck}
            />
          </div>
        ) : null}
      </div>
      <div className={join(styles.tableCell, styles.title)}>
        <EditableField
          defaultValue={data.title}
          onChangeEnd={async (value) => {
            await api.updateTask(data.id, { title: value })
          }}
        />
      </div>
      <div className={join(styles.tableCell, styles.project)}>
        {data.project.name}
      </div>
      <div className={join(styles.tableCell, styles.status)}>
        <div className={styles.statusContent}>
          <SelectorProxy
            options={statusOptions}
            defaultValue={data.status}
            defaultOption={{
              label: "ステータスを選択してください",
              value: "",
            }}
            onSelect={async (option) => {
              await api.updateTask(data.id, { status: option.value })
            }}
          />
        </div>
      </div>
      <div className={styles.tableCell}>
        <EditableField
          type="date"
          defaultValue={data.deadline.format() || ""}
          onChangeEnd={(value) => {
            api.updateTask(data.id, { deadline: value })
          }}
        />
      </div>
      <div className={styles.tableCell}>
        <EditableField
          type="date"
          placeholder="日時を入力..."
          defaultValue={data.startingAt?.format() || ""}
          max={data.deadline?.forHtml}
          onChangeEnd={(value) => {
            api.updateTask(data.id, { startingAt: value })
          }}
        />
      </div>
      <div className={styles.tableCell}>
        <EditableField
          type="date"
          placeholder="日時を入力..."
          defaultValue={data.finishedAt?.format() || ""}
          onChangeEnd={(value) => {
            api.updateTask(data.id, { finishedAt: value })
          }}
        />
      </div>
      <div className={join(styles.tableCell, styles.detail)}>
        <Link href={route.main.tasks.with(data.id)}>
          <div className={styles.detailCircle}>
            <Icon className={styles.detailIcon} name="arrowForward" />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default TaskTable
