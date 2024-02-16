"use client";
import { useState } from "react";
import Button from "@/components/shared/button";
import UsersLayout from "@/components/users/layout";
import styles from "./page.module.css";
import { classHelper } from "@/lib/cls";
import Select from "@/components/shared/select";
import {useNotice, useUnimplementedPage} from "@/hooks/useNotice";

const colors = [
  "var(--primary-color)",
  "var(--danger-color)",
  "#D9E76C",
  "var(--info-color)",
  "var(--warn-color)",
];

export default function Design() {
  const [colorIndex, setColorIndex] = useState(0);
  const { unimplementedFunc } = useNotice();
  useUnimplementedPage()

  return (
    <UsersLayout>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.title}>テーマカラー</h2>
            <div className={styles.palette}>
              <ul className={styles.paletteList}>
                {colors.map((color, index) => (
                  <li
                    key={color}
                    className={classHelper({
                      [styles.paletteItem]: true,
                      [styles.paletteItemActive]: index === colorIndex,
                    })}
                    onClick={() => setColorIndex(index)}>
                    <div
                      className={classHelper({
                        [styles.color]: true,
                        [styles.palleteActive]: index === colorIndex,
                      })}
                      style={{ background: color }}></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.footer}>
              <div className={styles.action}>
                <Button variant="primary" onClick={unimplementedFunc}>更新</Button>
                <Button>キャンセル</Button>
              </div>
            </div>
          </div>
          <div className={styles.section}>
            <h2 className={styles.title}>サイドバー</h2>
            <div className={styles.sidebarOption}>
              <Select
                data={[
                  {
                    label: "左",
                    value: "left",
                  },
                  {
                    label: "右",
                    value: "right",
                  },
                ]}
                defaultOption={{ label: "左", value: "left" }}
              />
            </div>
            <div className={styles.footer}>
              <div className={styles.action}>
                <Button variant="primary" onClick={unimplementedFunc}>更新</Button>
                <Button>キャンセル</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UsersLayout>
  );
}
