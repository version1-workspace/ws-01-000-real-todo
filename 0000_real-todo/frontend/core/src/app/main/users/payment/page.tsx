"use client";
import styles from "./page.module.css";
import Button from "@/components/common/button";
import Icon from "@/components/common/icon";
import { useAuth } from "@/components/auth";
import UsersLayout from "@/components/users/layout";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <UsersLayout>
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.header}>
            <h2 className={styles.title}>カード情報</h2>
          </div>
          <div className={styles.body}>
            <div className={styles.row}>
              <div className={styles.radio}>
                <input type="radio"  checked/>
              </div>
              <div className={styles.card}>
                <div className={styles.cardName}>カード １</div>
                <div className={styles.cardBrand}>Master Card</div>
                <div className={styles.cardNumber}>{"XXXX XXXX XXXX 1234"}</div>
                <div className={styles.cardHolderName}>YOUR NAME</div>
                <div className={styles.cardExpiryDate}>2026/01/01</div>
              </div>
            </div>
            <div className={styles.cardBorder}></div>
            <div className={styles.addCard}>
              <Icon name="add" className={styles.addCardIcon}/>
              <p>新しいカードを追加する</p>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.actionButtons}>
              <Button variant="primary">更新</Button>
              <Button>リセット</Button>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.header}>
            <h2 className={styles.title}>請求者情報</h2>
          </div>
          <div className={styles.body}>
            <div className={styles.field}>
              <div className={styles.label}>
                氏名:
              </div>
              <div className={styles.value}>
                YOUR NAME
              </div>
            </div>
            <div className={styles.field}>
              <div className={styles.label}>
                住所:
              </div>
              <div className={styles.value}>
                東京都千代田区左 １２３ー４５
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.actionButtons}>
              <Button variant="primary">更新</Button>
              <Button>リセット</Button>
            </div>
          </div>
        </div>
      </div>
    </UsersLayout>
  );
}
