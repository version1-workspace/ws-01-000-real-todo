import styles from "./index.module.css";

interface Props {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const variantStyles = {
  default: styles.default,
  primary: styles.primary,
  secondary: styles.secondary,
};

export default function Button({
  children,
  variant,
  className,
  ...rest
}: Props) {
  const variantClass = variantStyles[variant || "default"];
  return (
    <button
      className={[styles.button, variantClass, className].join(" ")}
      type="button"
      {...rest}>
      {children}
    </button>
  );
}
