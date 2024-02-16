'use client';
import styles from "./page.module.css";
import { join } from "@/lib/cls";
import TextInput from "@/components/shared/input/text";
import Button from "@/components/shared/button";
import Icon from "@/components/shared/icon";
import { useAuth } from "@/components/auth";
import UsersLayout from "@/components/users/layout";
import { useNotice, useUnimplementedPage } from "@/hooks/useNotice";

export default function Profile() {
  const { user } = useAuth();
  const { unimplementedFunc } = useNotice();
  useUnimplementedPage();

  if (!user) {
    return null;
  }

  return (
    <UsersLayout>
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.field}>
            <div className={styles.label}>アイコン:</div>
            <div className={join(styles.text, styles.avater)}>
              <div className={styles.avatarBox}>
                <Icon className={styles.defaultAvatar} name="person" />
              </div>
              <div>
                <input type="file" />
              </div>
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>ユーザネーム:</div>
            <div className={styles.text}>
              <TextInput value={user.username} />
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>登録日:</div>
            <div className={styles.text}>{user.createdAt.format()}</div>
          </div>
          <div className={styles.footer}>
            <div className={styles.actionButtons}>
              <Button variant="primary" onClick={unimplementedFunc} >更新</Button>
              <Button>リセット</Button>
            </div>
          </div>
        </div>
      </div>
    </UsersLayout>
  );
}
