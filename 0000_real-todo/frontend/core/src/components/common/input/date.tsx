import { join } from "@/lib/cls";
import { ChangeEvent, ForwardedRef, forwardRef } from "react";
import styles from "./date.module.css";

interface Props {
  value?: string;
  placeholder?: string;
  max?: string;
  min?: string;
  containerClassName?: string;
  inputClassName?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default forwardRef(function DateInput(
  {
    value,
    placeholder,
    max,
    min,
    containerClassName,
    inputClassName,
    onChange,
  }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const _value = value?.replaceAll("/", "-");
  return (
    <div className={join(styles.container, containerClassName)}>
      <input
        ref={ref}
        className={join(styles.input, inputClassName)}
        type="date"
        value={_value}
        max={max}
        min={min}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
});
