"use client";
import { useEffect, useState } from "react";
import styles from "@/components/tasks/popupMenu/index.module.css";
import { classHelper } from "@/lib/cls";

interface Props {
  trigger: React.ReactNode;
  actions: Action[];
}

interface Action {
  key: string;
  logo: React.ReactNode;
  text: string;
  danger?: boolean;
  onClick: () => void;
}

export default function PopupMenu({ trigger, actions }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const parent = e.target?.closest("." + styles.container);
      if (!parent) {
        setShow(false);
      }
    };
    document.body.addEventListener("click", listener);

    return () => {
      document.body.removeEventListener("click", listener);
    };
  }, [show]);

  return (
    <div className={styles.container}>
      <div onClick={() => setShow(true)}>{trigger}</div>
      {show ? (
        <ul className={styles.popupMenu}>
          <li className={styles.header}></li>
          {(actions || []).map((it, index) => {
            return (
              <li
                key={it.text}
                className={classHelper({
                  [styles.action]: true,
                  [styles.danger]: it.danger,
                  [styles.lastAction]: index == actions.length - 1,
                })}
                onClick={() => {
                  it.onClick();
                  setShow(false);
                }}>
                {it.logo}
                <p className={styles.text}>{it.text}</p>
                <p className={styles.border}></p>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
