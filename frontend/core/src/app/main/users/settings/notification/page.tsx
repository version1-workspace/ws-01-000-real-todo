"use client";
import Button from "@/components/shared/button";
import UsersLayout from "@/components/users/layout";
import styles from "./page.module.css";
import Select from "@/components/shared/select";
import useProjects from "@/contexts/projects";
import { useNotice, useUnimplementedPage } from "@/hooks/useNotice";

export default function Notification() {
  const { projects } = useProjects();
  const { unimplementedFunc } = useNotice();
  useUnimplementedPage();

  return (
    <UsersLayout>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.title}>通知</h2>
            <div className={styles.field}>
              <div className={styles.label}>お知らせ</div>
              <div className={styles.value}>
                <Select
                  data={[
                    { label: "ON", value: "on" },
                    { label: "OFF", value: "off" },
                  ]}
                  defaultOption={{ label: "ON", value: "on" }}
                />
              </div>
            </div>
            <div className={styles.subSection}>
              <div className={styles.subSectionHeader}>
                <h2 className={styles.subSectionTitle}>期限日アラート</h2>
                <div className={styles.border}></div>
              </div>
              <div className={styles.alerts}>
                {projects.map((it) => (
                  <div className={styles.alert} key={it.id}>
                    <div className={styles.label}>{it.name}</div>
                    <div className={styles.value}>
                      <Select
                        data={[
                          { label: "ON", value: "on" },
                          { label: "OFF", value: "off" },
                        ]}
                        defaultOption={{ label: "ON", value: "on" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.footer}>
              <div className={styles.action}>
                <Button variant="primary" onClick={unimplementedFunc}>
                  更新
                </Button>
                <Button>キャンセル</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UsersLayout>
  );
}
