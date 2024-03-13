import styles from "./index.module.scss";
import Link from "next/link";

const footerMenus = [
  {
    title: "Turbo について",
    list: [
      {
        label: "Home",
        link: "",
      },
      {
        label: "料金",
        link: "",
      },
    ],
  },
  {
    title: "ドキュメント",
    list: [
      {
        label: "Turoboの使い方",
        link: "",
      },
      {
        label: "使用者のレビュー",
        link: "",
      },
      {
        label: "プライバシーポリシー",
        link: "",
      },
      {
        label: "個人情報保護方針 ",
        link: "",
      },
    ],
  },
  {
    title: "企業",
    list: [
      {
        label: "会社概要",
        link: "",
      },
      {
        label: "メディア",
        link: "",
      },
      {
        label: "Twitter",
        link: "",
      },
    ],
  },
];

export default function FooterComponent() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.logo}>Turbo</div>
          <div className={styles.description}>
            Turbo で生活のゴールを決めて、
            <br />
            より良い生活を手に入れよう。
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.menu}>
            {footerMenus.map((menu) => {
              if (!menu.list.length) {
                return;
              }

              return (
                <div className={styles.menuItem} key={menu.title}>
                  <h3 className={styles.menuTitle}>{menu.title}</h3>
                  <ul className={styles.links}>
                    {menu.list.map((item) => (
                      <li className={styles.linkItem} key={item.label}>
                        <Link href={item.link}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
