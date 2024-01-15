"use client";
import { Metadata } from "next";
import Link from "next/link";
import styles from "./index.module.css";
import Input from "@/components/common/textInput";
import Button from "@/components/common/button";
import ShowIf from "@/components/common/showIf";
import { useForm } from "@/hooks/useForm";
import api from "@/services/api";
import { useToast } from "@/lib/toast/hook";

export const metadata: Metadata = {
  title: "Turbo | ログイン",
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
        api.client.setAccessToken(res.accessToken);
      } catch (e) {
        error("メールアドレスかパスワードに誤りがあります。")
      }
    },
  });

  const errorMessages = errors.object;

  return (
    <div className={styles.form}>
      <h2 className={styles.formTitle}>ログイン</h2>
      <div className={styles.field}>
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
      <div className={styles.field}>
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
      <div className={styles.field}>
        <label>
          <input
            type="checkbox"
            checked={form.rememberMe}
            placeholder="***********"
            onChange={(e) => {
              change({ rememberMe: !!e.target.value });
            }}
          />
          自動的にログインする
        </label>
      </div>
      <div className={styles.field}>
        <Button variant="primary" onClick={submit}>
          ログイン
        </Button>
        <ShowIf value={errorMessages.authentication}>
          <p className={styles.errorMessage}>{errorMessages.authentication}</p>
        </ShowIf>
        <div className={styles.details}>
          新規登録は
          <Link className={styles.link} href="/login">
            こちら
          </Link>
        </div>
      </div>
    </div>
  );
}
