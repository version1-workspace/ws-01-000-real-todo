import styles from "./index.module.css";
import {
  IoAddOutline as Plus,
  IoInformationCircleSharp as Info,
  IoNotificationsSharp as Notification,
  IoPerson as Person,
  IoSearch as Search,
} from "react-icons/io5";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <h2>Turbo</h2>
          </div>
          <div className={styles.searchForm}>
            <div className={styles.search}>
              <Search size="24px" color="#2e2e2e" />
              <input type="text" placeholder="タスクタイトルで検索" />
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <ul className={styles.menu}>
            <li className={styles.menuItem}>
              <Plus size="24px" />
            </li>
            <li className={styles.menuItem}>
              <Info size="24px" />
            </li>
            <li className={styles.menuItem}>
              <Notification size="24px" />
            </li>
          </ul>
          <div className={styles.avatarIcon}>
            <div className={styles.avatarCircleContaiener}>
              <Person size="20px" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
