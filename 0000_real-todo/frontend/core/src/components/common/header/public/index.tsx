import styles from "./index.module.css";
import Link from "next/link";
import Button from "@/components/common/button";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <h2>Turbo</h2>
        </Link>
      </div>
      <div className={styles.right}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>Turbo について</li>
          <li className={styles.menuItem}>ドキュメント</li>
          <li className={styles.menuItem}>
            <Link href="/login">サインイン</Link>
          </li>
        </ul>
        <Link href="/login">
          <Button variant="primary">無料で始める</Button>
        </Link>
      </div>
    </header>
  );
}
