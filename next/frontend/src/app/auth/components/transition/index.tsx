import { useMemo } from "react";
import styles from "./index.module.css";

interface Props {
  position: "left" | "right";
  duration: number;
  transitioning: boolean;
  on: React.ReactNode;
  off: React.ReactNode;
}

const stylesByParams = {
  default: {
    left: {
      borderTopLeftRadius: "8px",
      borderBottomLeftRadius: "8px",
      borderTopRightRadius: "0px",
      borderBottomRightRadius: "0px",
    },
    right: {
      borderTopLeftRadius: "0px",
      borderBottomLeftRadius: "0px",
      borderTopRightRadius: "8px",
      borderBottomRightRadius: "8px",
    },
  },
  on: {
    left: {
      right: "0%",
    },
    right: {
      right: "50%",
    },
  },
  off: {
    left: {
      right: "50%",
    },
    right: {
      right: 0,
    },
  },
};

export default function Transition({
  position,
  transitioning,
  duration,
  on,
  off,
}: Props) {
  const defaultStyles = stylesByParams.default[position];
  const onStyles = stylesByParams.on[position];
  const offStyles = stylesByParams.off[position];
  const baseStyles = useMemo(
    () =>
      ({
        position: "absolute",
        transition: `all ${duration}ms`,
        width: "50%",
        height: "600px",
        ...defaultStyles,
      }) as React.CSSProperties,
    [defaultStyles, duration],
  );
  const contentStyles = useMemo(
    () => ({
      transition: `opacity ${duration}ms`,
      opacity: transitioning ? 0 : 1,
    }),
    [duration, transitioning],
  );
  return (
    <div className={styles.container}>
      <div
        style={{
          ...baseStyles,
          ...onStyles,
        }}>
        <div className={styles.content} style={contentStyles}>
          {!transitioning ? on : null}
        </div>
      </div>
      <div
        style={{
          ...baseStyles,
          ...offStyles,
          background: "var(--primary-color)",
        }}>
        <div className={styles.content} style={contentStyles}>
          {!transitioning ? off : null}
        </div>
      </div>
    </div>
  );
}
