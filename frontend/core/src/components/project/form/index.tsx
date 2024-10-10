import styles from "./index.module.css";
import { useForm } from "@/hooks/useForm";
import api from "@/services/api";
import TextInput from "@/components/shared/input/text";
import DateInput from "@/components/shared/input/date";
import { Project } from "@/services/api/models/project";
import { join } from "@/lib/cls";
import Button from "@/components/shared/button";
import { useToast } from "@/lib/toast/hook";
import ErrorMessage from "@/components/shared/errorMessage";

interface Props {
  title: string;
  data?: Project;
  onSubmit: (form: Form) => void;
  onCancel: () => void;
}

interface Form {
  name: string;
  goal: string;
  shouldbe: string;
  slug: string;
  deadline: string;
}

const Form = ({ title, data, onSubmit, onCancel }: Props) => {
  const toast = useToast();
  const { submit, change, errors, form } = useForm<Form>({
    initialValues: {
      name: data?.name || "",
      goal: data?.goal || "",
      shouldbe: data?.shouldbe || "",
      slug: data?.slug || "",
      deadline: data?.deadline?.forHtml || "",
    },
    validate: (values, { errors }) => {
      if (!values.name) {
        errors.set("name", "プロジェクト名を設定してください");
      }

      if (!values.goal) {
        errors.set("goal", "ゴールを設定してください");
      }

      if (!values.deadline) {
        errors.set("deadline", "期限を設定してください");
      }

      if (!values.slug) {
        errors.set("deadline", "スラッグを設定してください");
      }

      return errors;
    },
    onSubmit: async (values: Form) => {
      try {
        await api.updateProject(data?.slug || "", values);

        onSubmit(values);

        toast.success("プロジェクトを更新しました。");
      } catch {
        toast.error("プロジェクトの更新に失敗しました。");
      }
    },
  });

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
              プロジェクト名
            </div>
            <div className={styles.input}>
              <TextInput
                type="text"
                value={form.name}
                placeholder="プロジェクト名を入力"
                onChange={(e) => {
                  change({ name: e.target.value });
                }}
              />
              <ErrorMessage message={errorMessages.title} />
            </div>
          </div>
          <div className={styles.field}>
            <div className={join(styles.label, styles.required)}>スラッグ</div>
            <div className={styles.input}>
              <TextInput
                type="text"
                value={form.slug}
                placeholder="スラッグを入力"
                onChange={(e) => {
                  change({ slug: e.target.value });
                }}
              />
              <ErrorMessage message={errorMessages.slug} />
            </div>
          </div>
          <div className={styles.field}>
            <div className={join(styles.label, styles.required)}>目標</div>
            <div className={styles.input}>
              <TextInput
                type="text"
                value={form.goal}
                placeholder="目標を入力"
                onChange={(e) => {
                  change({ goal: e.target.value });
                }}
              />
              <ErrorMessage message={errorMessages.goal} />
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>あるべき姿</div>
            <div className={styles.input}>
              <TextInput
                type="text"
                value={form.shouldbe}
                placeholder="あるべき姿を入力"
                onChange={(e) => {
                  change({ shouldbe: e.target.value });
                }}
              />
              <ErrorMessage message={errorMessages.goal} />
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
        </div>
        <div className={styles.footer}>
          <div className={styles.buttons}>
            <Button
              variant="primary"
              onClick={() => {
                submit();
              }}>
              <span className={styles.buttonText}>更新</span>
            </Button>
            <Button variant="secondary" onClick={onCancel}>
              <span className={styles.buttonText}>キャンセル</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
