import { useForm } from "@/hooks/useForm";
import dayjs from "dayjs";
import { ja } from "@/lib/transltate";
import styles from "./index.module.css";

interface Props {}

interface Form {
  projectId?: string;
  title: string;
  startingAt?: string;
  deadline: string;
}

const selectableStatus = ["scheduled", "completed", "archived"];

const taskStatuses = ja.derive("task.status")!;

const Form = ({}: Props) => {
  const { submit, change, errors, form } = useForm<Form>({
    initialValues: {
      projectId: undefined,
      title: "",
      startingAt: undefined,
      deadline: dayjs().format(),
    },
    validate: (values, { errors }) => {
      return errors;
    },
    onSubmit: async (values: Form) => {},
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.field}>
          <div className={styles.label}>プロジェクト名</div>
          <div className={styles.input}>
            <input type="text" />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>タスク名</div>
          <div className={styles.input}>
            <input type="text" />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>締切日</div>
          <div className={styles.input}>
            <input type="date" />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>開始予定日</div>
          <div className={styles.input}>
            <input type="date" />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>ステータス</div>
          <div className={styles.input}>
            <select>
              {selectableStatus.map((status: string) => {
                return (
                  <option key={status} value={status}>
                    {taskStatuses.t(status)}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
