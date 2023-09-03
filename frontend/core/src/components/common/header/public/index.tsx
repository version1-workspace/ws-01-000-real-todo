import styles from "./index.module.css";
import Button from "@/components/common/button";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h2>Turbo</h2>
      </div>
      <div className={styles.right}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>Turbo について</li>
          <li className={styles.menuItem}>ドキュメント</li>
          <li className={styles.menuItem}>サインイン</li>
        </ul>
        <Button variant="primary">無料で始める</Button>
      </div>
    </header>
  );
}
