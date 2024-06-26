import styles from "./index.module.scss";
import Link from "next/link";
import Button from "@/components/shared/button";
import Image from "next/image";
import logo from "@/assets/logo.png";

interface Props {
  light?: boolean;
}

export default function Header({ light }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <div
            className={[
              styles.logoContent,
              light ? styles.logoContentLight : "",
            ].join(" ")}>
            <Image src={logo} alt="ロゴ" />
            <h2>Turvo</h2>
          </div>
        </Link>
      </div>
      <div className={styles.right}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>Turvo について</li>
          <li className={styles.menuItem}>ドキュメント</li>
        </ul>
        <div className={styles.actions}>
          <Link className={styles.signup} href="/login">
            <Button variant="primary">無料で始める</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">サインイン</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
