import styles from "@/components/project/forms/goal/index.module.css";
import Goal from "@/components/project/goal";
import { join } from "@/lib/cls";
import Project from "@/components/project/forms/project";

interface Props {
  className?: string;
}

export default function GoalForm({ className }: Props) {
  return (
    <div className={join(styles.container, className || "")}>
      <Project />
      <div className={styles.border}></div>
      <Goal />
    </div>
  );
}
