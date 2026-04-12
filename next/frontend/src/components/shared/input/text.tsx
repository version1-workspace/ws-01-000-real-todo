import { join } from "@/lib/cls";
import { ChangeEvent, ForwardedRef, forwardRef } from "react";
import styles from "./text.module.css";

interface Props {
  value: string;
  type?: "text" | "password";
  placeholder?: string;
  containerClassName?: string;
  inputClassName?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default forwardRef(function Input(
  {
    type,
    value,
    placeholder,
    containerClassName,
    inputClassName,
    onChange,
  }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <div className={join(styles.container, containerClassName)}>
      <input
        ref={ref}
        className={join(styles.text, inputClassName)}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
});
