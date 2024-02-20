import styles from "./index.module.css";
import { useForm } from "@/hooks/useForm";
import api from "@/services/api";
import TextInput from "@/components/shared/input/text";
import DateInput from "@/components/shared/input/date";
import { Project } from "@/services/api/models/project";
import { AppDate } from "@/lib/date";
import {
  selectableStatus,
  statusOptions,
  StatusType,
  Task,
  TaskParams,
} from "@/services/api/models/task";
import Select, { OptionItem } from "@/components/shared/select";
import TextArea from "@/components/shared/input/textarea";
import { join } from "@/lib/cls";
import Button from "@/components/shared/button";
import { useToast } from "@/lib/toast/hook";
import ErrorMessage from "@/components/shared/errorMessage";
import useMilestones from "@/hooks/useMilestones";
import { useEffect } from "react";
import useProjects from "@/contexts/projects";

interface Props {
  title: string;
  data?: Task;
  onSubmit: () => void;
  onCancel: () => void;
}

interface Form {
  project?: Project;
  parent: Task;
  title: string;
  description: string;
  startingAt?: string;
  deadline: string;
  status?: StatusType;
  children: TaskParams[];
}

const Form = ({ title, data, onSubmit, onCancel }: Props) => {
  const toast = useToast();
  const { projects, options: projectOptions } = useProjects();
  const {
    fetch: fetchMilestones,
    milestones,
    options: milestoneOptions,
  } = useMilestones();
  const { submit, change, errors, form } = useForm<Form>({
    initialValues: {
      project: data?.project,
      parent: data?.parent as Task,
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

  const errorMessages = errors.object;

  useEffect(() => {
    if (data?.project) {
      fetchMilestones({ slug: data.project.slug });
    }
  }, [data]);

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
                  if (project) {
                    fetchMilestones({ slug: project.slug });
                  }
                }}
              />
              <ErrorMessage message={errorMessages.project} />
            </div>
          </div>
          {form.project && !data?.isMilestone ? (
            <div className={styles.field}>
              <div className={styles.label}>マイルストーン</div>
              <div className={styles.input}>
                <Select
                  data={milestoneOptions}
                  value={form.parent?.id}
                  defaultOption={{
                    label: "マイルストーンを選択してください",
                    value: "",
                  }}
                  onSelect={(option) => {
                    const parent = milestones.find(
                      (it) => it.id === option.value,
                    );

                    change({ parent });
                  }}
                />
                <ErrorMessage message={errorMessages.milestone} />
              </div>
            </div>
          ) : null}
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
              <DateInput
                value={form.startingAt}
                onChange={(e) => {
                  change({ startingAt: e.target.value });
                }}
              />
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
