import styles from "./index.module.css";
import { User } from "@/services/api/models/user";
import TextInput from "@/components/common/input/text";
import Button from "@/components/common/button";
import { useForm } from "@/hooks/useForm";

interface PageProps {
  user: User;
}

function MailForm({ user }: PageProps) {
  const { form, change } = useForm({
    initialValues: {
      value: user.email,
      confirmation: "",
    },
    validate: (values, { errors }) => {
      return errors;
    },
    onSubmit: () => {},
  });

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>メールアドレス変更</h2>
      <div className={styles.field}>
        <div className={styles.label}>新規メールアドレス:</div>
        <div className={styles.input}>
          <TextInput
            value={form.value}
            onChange={(e) => change({ value: e.target.value })}
          />
        </div>
      </div>
      <div className={styles.field}>
        <div className={styles.label}>メールアドレス確認用:</div>
        <div className={styles.input}>
          <TextInput
            value={form.confirmation}
            onChange={(e) =>
              change({
                confirmation: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.actions}>
          <Button variant="primary">更新</Button>
          <Button>リセット</Button>
        </div>
      </div>
    </div>
  );
}

function PasswordForm({ user }: PageProps) {
  const { form, change } = useForm({
    initialValues: {
      value: "",
      confirmation: "",
    },
    validate: (values, { errors }) => {
      return errors;
    },
    onSubmit: () => {},
  });

  return (
    <form className={styles.form} autoComplete="off">
      <h2 className={styles.title}>パスワード変更</h2>
      <div className={styles.field}>
        <div className={styles.label}>新規パスワード:</div>
        <div className={styles.input}>
          <TextInput
            type="password"
            value={form.value}
            onChange={(e) => change({ value: e.target.value })}
          />
        </div>
      </div>
      <div className={styles.field}>
        <div className={styles.label}>新規パスワード確認用:</div>
        <div className={styles.input}>
          <TextInput
            type="password"
            value={form.confirmation}
            onChange={(e) =>
              change({
                confirmation: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.actions}>
          <Button variant="primary">更新</Button>
          <Button>リセット</Button>
        </div>
      </div>
    </form>
  );
}

export default function Auth({ user }: PageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <MailForm user={user} />
        <PasswordForm user={user} />
      </div>
    </div>
  );
}
