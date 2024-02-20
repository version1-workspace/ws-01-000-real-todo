import { ChangeEvent } from "react";
import styles from "./textarea.module.css";

interface Props {
  value: string;
  placeholder?: string;
  rows?: number;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextArea({
  value,
  rows = 10,
  placeholder,
  onChange,
}: Props) {
  return (
    <div className={styles.container}>
      <textarea
        className={styles.textarea}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
