import { ReactNode } from "react";
import { IoCloseOutline as Close } from "react-icons/io5";
import { classHelper } from "@/lib/cls";
import styles from "./index.module.css";

export interface ContainerConfig {
  width: string;
}

interface Props {
  show?: boolean;
  config: ContainerConfig;
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ config, show, children, onClose }: Props) => {
  return (
    <div
      className={classHelper({
        [styles.container]: true,
        [styles.show]: show,
        [styles.hide]: !show,
      })}
      onClick={onClose}>
      <div
        style={{ width: config.width }}
        className={styles.content}
        onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <Close className={styles.close} onClick={onClose} />
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
