import styles from "./index.module.css";
import { useForm } from "@/hooks/useForm";
import { ja } from "@/lib/transltate";
import api from "@/services/api";
import TextInput from "@/components/common/input/text";
import DateInput from "@/components/common/input/date";
import { Project } from "@/services/api/models/project";
import { AppDate } from "@/lib/date";
import { StatusType, Task, TaskParams } from "@/services/api/models/task";
import { useProjects } from "@/hooks/useProjects";
import Select, { OptionItem } from "@/components/common/select";
import { useMemo } from "react";
import TextArea from "@/components/common/input/textarea";
import { join } from "@/lib/cls";
import Button from "@/components/common/button";
import { useToast } from "@/lib/toast/hook";
import ErrorMessage from "@/components/common/errorMessage";

interface Props {
  title: string;
  data?: Task;
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
  children: TaskParams[];
}

const taskStatuses = ja.derive("task.status")!;

const selectableStatus: StatusType[] = ["scheduled", "completed", "archived"];

const statusOptions = selectableStatus.map((it) => {
  return { label: taskStatuses.t(it), value: it };
});

const Form = ({ title, data, onSubmit, onCancel }: Props) => {
  const { projects } = useProjects();
  const toast = useToast();
  const { submit, change, errors, form } = useForm<Form>({
    initialValues: {
      project: data?.project,
      title: data?.title || "",
      description: data?.description || "",
      startingAt: data?.startingAt,
      deadline: data?.deadline?.forHtml || AppDate.in(7).toString(),
      status: data?.status || "scheduled",
      children: [],
    },
    validate: (values, { errors }) => {
      if (!values.project) {
        errors.set("project", "プロジェクトを設定してください");
      }

      if (!values.title) {
        errors.set("title", "タイトルを設定してください");
      }

      if (!values.deadline) {
        errors.set("deadline", "期限を設定してください");
      }

      return errors;
    },
    onSubmit: async (values: Form) => {
      const { project, ...rest } = values;
      try {
        await api.createTask({
          data: { ...rest, projectId: project?.id, kind: "task" },
        });

        onSubmit();

        toast.success("タスクを追加しました。");
      } catch {
        toast.error("タスクの追加に失敗しました。");
      }
    },
  });

  const projectOptions = useMemo(() => {
    return projects.reduce((acc: OptionItem[], it: Project) => {
      return [...acc, { label: it.name, value: it.id }];
    }, []);
  }, [projects]);

  const errorMessages = errors.object;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.form}>
          <div className={styles.field}>
            <div className={join(styles.label, styles.required)}>
              プロジェクト
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
              <ErrorMessage message={errorMessages.project} />
            </div>
          </div>
          <div className={styles.field}>
            <div className={join(styles.label, styles.required)}>タスク</div>
            <div className={styles.input}>
              <TextInput
                type="text"
                value={form.title}
                placeholder="タスクを入力。 例)  英会話レッスンの予約、React公式ドキュメントを1ページ読む"
                onChange={(e) => {
                  change({ title: e.target.value });
                }}
              />
              <ErrorMessage message={errorMessages.title} />
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>説明・メモ</div>
            <div className={styles.input}>
              <TextArea
                value={form.description}
                rows={5}
                placeholder="タスクの説明・メモ"
                onChange={(e) => {
                  change({ description: e.target.value });
                }}
              />
            </div>
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
              <ErrorMessage message={errorMessages.deadline} />
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
              }}>
              {data ? "更新" : "作成"}
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
