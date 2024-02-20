import { useState } from "react";
import { IoCheckmark } from "react-icons/io5";
import styles from "./index.module.css";

interface Props {
  label: string;
  defaultValue: boolean;
  onClick: (checked: boolean) => void;
}

export default function Checkbox({ label, defaultValue, onClick }: Props) {
  const [checked, setChecked] = useState(defaultValue);

  return (
    <div className={styles.container}>
      <label
        className={styles.label}
        htmlFor={label}
        onClick={() => {
          const next = !checked;
          setChecked(next);
          onClick(next);
        }}>
        <div className={styles.box}>
          {checked ? <IoCheckmark className={styles.check} /> : null}
        </div>
        <p>{label}</p>
      </label>
    </div>
  );
}
