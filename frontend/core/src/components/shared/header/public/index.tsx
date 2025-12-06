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
            <Image
              width={24}
              className={styles.logoImage}
              src={logo}
              alt="ロゴ"
            />
            <h2 className={styles.logoText}>Turvo</h2>
          </div>
        </Link>
      </div>
      <div className={styles.right}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <Link className={styles.menuLink} href="/">
              Home
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link className={styles.menuLink} href="/">
              Turvo について
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link className={styles.menuLink} href="/">
              ドキュメント
            </Link>
          </li>
        </ul>
        <div className={styles.actions}>
          <Link className={styles.signup} href="/auth/signup">
            <Button variant="primary">無料で始める</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="secondary">サインイン</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
