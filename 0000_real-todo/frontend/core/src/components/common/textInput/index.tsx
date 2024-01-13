import { ChangeEvent } from "react";
import styles from "./index.module.css";

interface Props {
  value: string;
  type?: "text" | "password";
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ type, value, placeholder, onChange }: Props) {
  return (
    <div className={styles.container}>
      <input
        className={styles.text}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
