import styles from "@/components/common/select/index.module.css";

interface Props {
  data: OptionItem[];
  value?: string;
  defaultOption: OptionItem;
  onSelect: (item: OptionItem) => void;
}

export interface OptionItem {
  label: string | React.ReactNode;
  value: string;
}

export default function Select({
  data,
  value,
  defaultOption,
  onSelect,
}: Props) {
  return (
    <select
      className={styles.container}
      value={value}
      onChange={(e) =>
        onSelect({ label: e.target.innerText, value: e.target.value })
      }>
      <option key={defaultOption.value} value={defaultOption.value}>
        {defaultOption.label}
      </option>
      {data.map((item) => {
        return (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </select>
  );
}
