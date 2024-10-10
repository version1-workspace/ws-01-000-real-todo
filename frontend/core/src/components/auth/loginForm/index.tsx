"use client";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";
import Input from "@/components/shared/input/text";
import Button from "@/components/shared/button";
import ShowIf from "@/components/shared/showIf";
import { useForm } from "@/hooks/useForm";
import api, { setUserId } from "@/services/api";
import { useToast } from "@/lib/toast/hook";
import Checkbox from "@/components/shared/checkbox";

export const metadata: Metadata = {
  title: "Turvo | ログイン",
};

interface Form {
  email: string;
  password: string;
  rememberMe: boolean;
  authentication?: boolean;
}

const mailFormat =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function Login() {
  const router = useRouter();
  const { error } = useToast();
  const { submit, change, errors, form } = useForm<Form>({
    initialValues: { email: "", password: "", rememberMe: false },
    validate: (values, { errors }) => {
      if (!values.email) {
        errors.set("email", "メールアドレスを入力してください");
      }

      if (!values.email.match(mailFormat)) {
        errors.set("email", "メールアドレス形式で入力してください");
      }

      if (!values.password) {
        errors.set("password", "パスワードを入力してください");
      }

      return errors;
    },
    onSubmit: async (values: Form) => {
      try {
        const res = await api.authenticate(values);
        const { data } = res;
        api.client.setAccessToken(data.accessToken);
        setUserId(data.uuid);

        router.push("/main");
      } catch (e) {
        error("メールアドレスかパスワードに誤りがあります。");
      }
    },
  });

  const errorMessages = errors.object;

  return (
    <div className={styles.form}>
      <div className={styles.copy}>
        <span className={styles.emoticon}>🏠</span>Welcome Back
        <span className={styles.emoticon}>😃</span>
      </div>

      <h2 className={styles.formTitle}>
        Sign In
        <div className={styles.formSubtitle}>ログインして Turvo を使う</div>
      </h2>
      <div className={styles.inputField}>
        <Input
          value={form.email}
          placeholder="turbo@example.com"
          onChange={(e) => {
            change({ email: e.target.value });
          }}
        />
        <ShowIf value={errorMessages.email}>
          <p className={styles.errorMessage}>{errorMessages.email}</p>
        </ShowIf>
      </div>
      <div className={styles.inputField}>
        <Input
          type="password"
          value={form.password}
          placeholder="***********"
          onChange={(e) => {
            change({ password: e.target.value });
          }}
        />
        <ShowIf value={errorMessages.password}>
          <p className={styles.errorMessage}>{errorMessages.password}</p>
        </ShowIf>
      </div>
      <Checkbox
        label="自動的にログインする"
        defaultValue={form.rememberMe}
        onClick={(checked) => change({ rememberMe: checked })}
      />
      <div className={styles.field}>
        <Button variant="primary" onClick={submit}>
          ログイン
        </Button>
        <ShowIf value={errorMessages.authentication}>
          <p className={styles.errorMessage}>{errorMessages.authentication}</p>
        </ShowIf>
      </div>
    </div>
  );
}
