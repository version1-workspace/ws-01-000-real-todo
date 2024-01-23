import { useForm } from "@/hooks/useForm";
import { ja } from "@/lib/transltate";
import styles from "./index.module.css";
import TextInput from "@/components/common/input/text";
import DateInput from "@/components/common/input/date";
import { Project } from "@/services/api/models/project";
import { AppDate } from "@/lib/date";
import { StatusType } from "@/services/api/models/task";
import { useProjects } from "@/hooks/useProjects";
import Select, { OptionItem } from "@/components/common/select";
import { useMemo } from "react";
import TextArea from "@/components/common/input/textarea";
import { join } from "@/lib/cls";
import Button from "@/components/common/button";

interface Props {
  title: string;
  onSubmit: () => void;
  onCancel: () => void;
}

interface Form {
  project?: Project;
  title: string;
  description: string;
  startingAt?: string;
  deadline: string;
  status?: StatusType;
}

const taskStatuses = ja.derive("task.status")!;

const selectableStatus: StatusType[] = ["scheduled", "completed", "archived"];

const statusOptions = selectableStatus.map((it) => {
  return { label: taskStatuses.t(it), value: it };
});

const Form = ({ title, onSubmit, onCancel }: Props) => {
  const { projects } = useProjects();
  const { submit, change, errors, form } = useForm<Form>({
    initialValues: {
      project: undefined,
      title: "",
      description: "",
      startingAt: undefined,
      deadline: AppDate.in(7).toString(),
      status: undefined,
    },
    validate: (values, { errors }) => {
      return errors;
    },
    onSubmit: async (values: Form) => {},
  });

  const projectOptions = useMemo(() => {
    return projects.reduce((acc: OptionItem[], it: Project) => {
      return [...acc, { label: it.name, value: it.id }];
    }, []);
  }, [projects]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.form}>
          <div className={styles.field}>
            <div className={join(styles.label, styles.required)}>
              プロジェクト名
            </div>
            <div className={styles.input}>
              <Select
                data={projectOptions}
                value={form.project?.id}
                defaultOption={{
                  label: "プログラムを選択してください",
                  value: "",
                }}
                onSelect={(option) => {
                  const project = projects.find((it) => it.id === option.value);
                  change({ project });
                }}
              />
            </div>
          </div>
          <div className={styles.field}>
            <div className={join(styles.label, styles.required)}>タスク</div>
            <TextInput
              type="text"
              value={form.title}
              placeholder="タスクを入力。 例)  英会話レッスンの予約、React公式ドキュメントを1ページ読む"
              onChange={(e) => {
                change({ title: e.target.value });
              }}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.label}>説明・メモ</div>
            <TextArea
              value={form.description}
              rows={5}
              placeholder="タスクの説明・メモ"
              onChange={(e) => {
                change({ description: e.target.value });
              }}
            />
          </div>
          <div className={styles.field}>
            <div className={join(styles.label, styles.required)}>締切日</div>
            <div className={styles.input}>
              <DateInput
                value={form.deadline}
                onChange={(e) => {
                  change({ deadline: e.target.value });
                }}
              />
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>開始予定日</div>
            <div className={styles.input}>
              <DateInput value={form.startingAt} />
            </div>
          </div>
          <div className={styles.field}>
            <div className={join(styles.label, styles.status)}>ステータス</div>
            <div className={styles.input}>
              <Select
                data={statusOptions}
                value={form.status}
                defaultOption={{
                  label: "ステータスを選択してください",
                  value: "",
                }}
                onSelect={(option) => {
                  const status = selectableStatus.find(
                    (it) => it === option.value,
                  );
                  change({ status });
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.buttons}>
            <Button
              variant="primary"
              onClick={() => {
                submit();
                onSubmit();
              }}>
              更新
            </Button>
            <Button variant="secondary" onClick={onCancel}>
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
