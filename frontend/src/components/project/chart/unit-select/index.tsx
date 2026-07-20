import Select, { type OptionItem } from "@/components/shared/select"
import styles from "./index.module.css"

export const ChartUnit = {
  year: "year",
  month: "month",
  week: "week",
  day: "day",
} as const

export type ChartUnitType = keyof typeof ChartUnit

const options: OptionItem[] = [
  { label: "年", value: ChartUnit.year },
  { label: "月", value: ChartUnit.month },
  { label: "週", value: ChartUnit.week },
  { label: "日", value: ChartUnit.day },
]

interface Props {
  value: ChartUnitType
  onChange: (value: ChartUnitType) => void
}

export default function ChartUnitSelect({ value, onChange }: Props) {
  return (
    <Select
      data={options}
      value={value}
      defaultOption={options[0]}
      onSelect={(item) => onChange(item.value as ChartUnitType)}
      containerStyleClass={styles.container}
    />
  )
}
