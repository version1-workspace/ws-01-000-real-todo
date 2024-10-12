"use client";
import { createContext, useState, useRef } from "react";
import {
  IoCloseOutline as Close,
  IoCheckmarkCircleOutline as Success,
  IoInformationCircleOutline as Info,
  IoAlertCircleOutline as Error,
} from "react-icons/io5";
import { Position } from "./config";
import { capitalFirstChar } from "./util";
import styles from "./index.module.css";

interface Config {
  variant: "info" | "success" | "error";
  message: string | React.ReactNode;
  duration?: number;
}

interface DefaultConfig {
  position: Position;
  maxCount?: number;
}

interface Element {
  id: number;
  config: Config;
}

const icons = {
  info: Info,
  success: Success,
  error: Error,
};

export const Toast = ({
  config,
  style,
  onClose,
}: {
  config: Config;
  style?: React.CSSProperties;
  onClose: () => void;
}) => {
  const variantStyle = styles[config.variant];
  const Icon = icons[config.variant];

  return (
    <div className={[styles.container, variantStyle].join(" ")} style={style}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Close className={styles.close} onClick={onClose} />
        </div>
        <div className={styles.body}>
          <div className={styles.iconContainer}>
            <Icon className={styles.icon} />
          </div>
          <div className={styles.message}>{config.message}</div>
        </div>
      </div>
    </div>
  );
};

export const ToastContext = createContext({
  notices: {} as { [key: string]: Element },
  push: (_config: Config) => -100 as number,
  remove: (_id: number) => {},
});

export const ToastContainer = ({
  config: defaultConfig,
  children,
}: {
  config: DefaultConfig;
  children: React.ReactNode;
}) => {
  const [, rerender] = useState({});
  const ref = useRef({
    id: 0,
    notices: {} as { [key: string]: Element },
  });

  const push = (config: Config) => {
    const { notices } = ref.current;
    const id = ref.current.id + 10;
    const newNotices: { [key: string]: Element } = {
      ...notices,
      [id]: {
        id,
        config,
      },
    };

    const maxCount = defaultConfig.maxCount || 10;
    const keys = Object.keys(newNotices);
    if (keys.length > maxCount) {
      keys
        .slice(0, keys.length - maxCount)
        .forEach((key) => delete newNotices[key]);
    }

    ref.current = {
      id,
      notices: newNotices,
    };

    rerender({});
    scrollTo(0, 0);

    return id;
  };

  const remove = (id: number) => {
    const { notices } = ref.current;
    const newNotices = structuredClone(notices);
    delete newNotices[id];
    ref.current = {
      id: ref.current.id + 10,
      notices: newNotices,
    };

    rerender({});
  };

  const { notices } = ref.current;
  const positionStyle =
    styles[`position${capitalFirstChar(defaultConfig.position)}`];

  const list = defaultConfig.position.startsWith("top")
    ? Object.values(notices).reverse()
    : Object.values(notices);

  return (
    <ToastContext.Provider value={{ notices, push, remove }}>
      {children}
      <ul className={[styles.toastContainer, positionStyle].join(" ")}>
        {list.map((item: Element) => {
          return (
            <li key={item.id}>
              <Toast config={item.config} onClose={() => remove(item.id)} />
            </li>
          );
        })}
      </ul>
    </ToastContext.Provider>
  );
};
