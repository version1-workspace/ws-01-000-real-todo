import styles from "@/components/shared/option/index.module.css";
import { classHelper } from "@/lib/cls";

interface Props {
  data: OptionItem[];
  value: string;
  onSelect: (item: OptionItem) => void;
}

interface OptionItem {
  label: string | React.ReactNode;
  value: string;
}

export default function Option({ data, value, onSelect }: Props) {
  return (
    <ul className={styles.container}>
      {data.map((item: OptionItem, index: number) => {
        return (
          <li key={item.value}>
            <span
              className={classHelper({
                [styles.optionItem]: true,
                [styles.optionItemLast]: index === data.length - 1,
                [styles.optionItemFirst]: index === 0,
                [styles.active]: item.value === value
              })}
              onClick={() => onSelect && onSelect(item)}
            >
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
