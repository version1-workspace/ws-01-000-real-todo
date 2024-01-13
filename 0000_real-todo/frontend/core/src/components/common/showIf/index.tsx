import { ReactNode } from "react";
import styles from "./index.module.css";

interface Props {
  value?: string | number | boolean;
  placeholder?: string;
  children: ReactNode;
}

const defaultPlaceholder = "XXXXXXXXXXXXXXXXX";

export default function ShowIf({ value, placeholder, children }: Props) {
  return (
    <div className={value ? styles.show : styles.hide}>
      {value ? children : defaultPlaceholder || placeholder}
    </div>
  );
}
