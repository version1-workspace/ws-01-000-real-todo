import { ChangeEvent } from "react";
import styles from "./date.module.css";

interface Props {
  value?: string;
  placeholder?: string;
  max?: string;
  min?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function DateInput({
  value,
  placeholder,
  max,
  min,
  onChange,
}: Props) {
  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="date"
        value={value}
        max={max}
        min={min}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
