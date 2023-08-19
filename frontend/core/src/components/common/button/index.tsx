import styles from "./index.module.css";

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Button({ children, className, ...rest }: Props) {
  return (
    <button className={[styles.button, className].join(" ")} {...rest}>
      {children}
    </button>
  );
}
