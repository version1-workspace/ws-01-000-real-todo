import styles from "./index.module.css";
import { classHelper } from "@/lib/cls";
import { usePathname } from "next/navigation";
import Link from "next/link";
import route from "@/lib/route";

interface MenuSetting {
  title: string;
  key: string;
  children?: MenuSetting[];
}

const menuSettings: MenuSetting[] = [
  {
    title: "ユーザ情報",
    key: "profile",
  },
  {
    title: "認証情報",
    key: "auth",
  },
  {
    title: "支払い情報",
    key: "payment",
  },
  {
    title: "設定",
    key: "settings",
    children: [
      {
        title: "デザイン",
        key: "settings/design",
      },
      {
        title: "通知",
        key: "settings/notification",
      },
    ],
  },
];

interface Props {
  children: React.ReactNode;
}

export default function UsersLayout({ children }: Props) {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>プロフィール・設定</h1>
        <div className={styles.body}>
          <div className={styles.sidebar}>
            <ul className={styles.menu}>
              {menuSettings.map((it) => {
                const href = it.children
                  ? "#!"
                  : route.main.users[it.key].toString();
                return (
                  <li key={it.key}>
                    <Link href={href}>
                      <p
                        className={classHelper({
                          [styles.menuItem]: true,
                          [styles.activeMenu]:
                            route.main.users[it.key].toString() === pathname,
                        })}>
                        {it.title}
                      </p>
                    </Link>
                    {it.children ? (
                      <ul className={styles.subMenu}>
                        {it.children.map((child) => {
                          return (
                            <li key={child.key}>
                              <Link
                                href={route.main.users[child.key].toString()}>
                                <p
                                  className={classHelper({
                                    [styles.menuItem]: true,
                                    [styles.subMenuItem]: true,
                                    [styles.activeMenu]:
                                      route.main.users[child.key].toString() ===
                                      pathname,
                                  })}>
                                  {child.title}
                                </p>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles.main}>{children}</div>
        </div>
      </div>
    </div>
  );
}
