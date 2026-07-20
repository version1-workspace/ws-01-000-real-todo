import { ChangeEvent, ForwardedRef, forwardRef } from "react"
import { join } from "@/lib/cls"
import styles from "./text.module.css"

interface Props {
  value: string
  type?: "text" | "password"
  icon?: React.ReactNode
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
    icon,
    placeholder,
    containerClassName,
    inputClassName,
    readOnly,
    onChange,
  }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  if (icon) {
    return (
      <InputWithIcon
        type={type}
        value={value}
        icon={icon}
        placeholder={placeholder}
        containerClassName={containerClassName}
        inputClassName={inputClassName}
        readOnly={readOnly}
        onChange={onChange}
      />
    )
  }

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

function InputWithIcon({
  type,
  value,
  icon,
  placeholder,
  containerClassName,
  inputClassName,
  readOnly,
  onChange,
}: Props) {
  return (
    <div className={join(styles.withIconContainer, containerClassName)}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <input
        className={join(styles.textWithIcon, inputClassName)}
        type={type}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly ?? !onChange}
        onChange={onChange ? (e) => onChange(e) : undefined}
      />
    </div>
  )
}
