import { ChangeEvent, ForwardedRef, forwardRef } from "react"
import { join } from "@/lib/cls"
import styles from "./text.module.css"

interface Props {
  value: string
  type?: "text" | "password"
  placeholder?: string
  containerClassName?: string
  inputClassName?: string
  readOnly?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export default forwardRef(function Input(
  {
    type,
    value,
    placeholder,
    containerClassName,
    inputClassName,
    readOnly,
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
        readOnly={readOnly ?? !onChange}
        onChange={onChange ? (e) => onChange(e) : undefined}
      />
    </div>
  )
})
