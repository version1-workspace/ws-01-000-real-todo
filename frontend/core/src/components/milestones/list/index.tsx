"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "./index.module.css";
import { classHelper } from "@/lib/cls";
import TaskTable from "../table";
import Icon from "@/components/shared/icon";
import { CheckContainer } from "@/contexts/check";
import useMilestones from "@/hooks/useMilestones";
import TaskForm from "@/components/tasks/form";
import Link from "next/link";
import route from "@/lib/route";
import { useModal } from "@/lib/modal";
import { factory } from "@/services/api/models";
import { Project } from "@/services/api/models/project";
import PopupMenu from "@/components/shared/popupMenu";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useToast } from "@/lib/toast/hook";

interface CollapseProps {
  header: React.ReactNode;
  children: React.ReactNode;
  disable?: boolean;
  maxHeight: number;
  line?: boolean;
  showMoreText?: string;
}

const Collapse = ({
  disable,
  showMoreText,
  maxHeight,
  header,
  children,
}: CollapseProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.collapseContainer}>
      <div className={styles.collapseHeader}>{header}</div>
      <div className={styles.collapseContent}>
        <div
          style={
            show
              ? {
                  maxHeight: `${Math.max(maxHeight, 240)}px`,
                }
              : undefined
          }
          className={classHelper({
            [styles.collapseBody]: true,
            [styles.collapseBodyShow]: show,
            [styles.collapseBodyEmpty]: disable,
          })}>
          {!show && !disable ? (
            <div className={styles.collapseShowMoreContainer}>
              <div className={styles.collapseShowMore}>
                <p
                  className={styles.collapseShowMoreText}
                  onClick={() => setShow(true)}>
                  {showMoreText || "子タスクを確認する"}
                </p>
              </div>
            </div>
          ) : null}
          {show ? children : null}
        </div>
      </div>
      {show && !disable ? (
        <div className={styles.collapaseHideContainer}>
          <div className={styles.collapseHide}>
            <div
              className={styles.collapseHideIcon}
              onClick={() => setShow(false)}>
              <Icon name="up" />
            </div>
            <p
              className={styles.collapseHideText}
              onClick={() => setShow(false)}>
              折りたたむ
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

interface Props {
  project: Project;
}

const rowHeight = 60;

export default function MilestoneList({ project }: Props) {
  const toast = useToast();
  const { milestones, orphans, fetch } = useMilestones();
  const { open, hide } = useModal();
  const router = useRouter();

  useEffect(() => {
    fetch({ slug: project.slug });
  }, []);

  if (!milestones) {
    return null;
  }

  return (
    <CheckContainer>
      <div className={styles.header}>
        <div className={styles.title}>マイルストーン</div>
        <div className={styles.currentPoint}>
          <p className={styles.todayDate}>{dayjs().format("YYYY/MM/DD")}</p>
          <p className={styles.todayText}>
            <span className={styles.emoticon}>🚶</span>
            今日・現在地点
          </p>
        </div>
      </div>
      <div className={styles.container}>
        {milestones.map((it) => {
          return (
            <div className={styles.milestone} key={it.uuid}>
              <Collapse
                showMoreText={`${it.children.length}件のタスク`}
                maxHeight={it.children.length * rowHeight}
                disable={it.children.length <= 0}
                header={
                  <div className={styles.milestoneTitle}>
                    <div className={styles.milestoneTitleText}>
                      <Icon
                        className={styles.milestoneTitleIcon}
                        name="milestone"
                      />
                      <Link href={route.main.tasks.with(it.id)}>
                        <p>{it.title}</p>
                      </Link>
                    </div>
                    <div className={styles.right}>
                      <p className={styles.deadline}>
                        あと{it.deadline.from()} 日
                        <span className={styles.deadlineDate}>
                          ({it.deadline.format()})
                        </span>
                      </p>
                      <p>
                        <PopupMenu
                          actions={[
                            {
                              key: "edit",
                              text: "編集する",
                              logo: <Icon name="edit" />,
                              onClick: () => {
                                router.push(route.main.tasks.with(it.id));
                              },
                            },
                            {
                              key: "archive",
                              text: "アーカイブする",
                              logo: <Icon name="archive" />,
                              danger: true,
                              onClick: async () => {
                                if (
                                  !confirm(
                                    "子タスクもまとめてアーカイブされますがよろしいでしょうか？",
                                  )
                                ) {
                                  return;
                                }

                                try {
                                  await api.archiveMilestone({
                                    slug: project.slug,
                                    id: it.id,
                                  });
                                  toast.success(
                                    "マイルストーンをアーカイブしました。",
                                  );
                                  await fetch({ slug: project.slug });
                                } catch (e) {
                                  toast.error("アーカイブに失敗しました。");
                                }
                              },
                            },
                          ]}
                          trigger={<Icon name="menu" interactive="pulse" />}
                        />
                      </p>
                    </div>
                  </div>
                }>
                {it.children.length ? (
                  <TaskTable data={it.children} />
                ) : (
                  <p className={styles.emptyChildren}>
                    子タスクが登録されていません。
                    <br />
                    <span
                      className={styles.addMilestone}
                      onClick={() => {
                        open({
                          content: (
                            <TaskForm
                              title="タスクを追加"
                              data={factory.task({
                                uuid: "",
                                title: "",
                                kind: "task" as const,
                                description: "",
                                status: "scheduled" as const,
                                project,
                                createdAt: "",
                                updatedAt: "",
                                deadline: "",
                                parent: it,
                                children: [],
                              })}
                              onSubmit={() => {
                                fetch({ slug: project.slug });
                                hide();
                              }}
                              onCancel={hide}
                            />
                          ),
                        });
                      }}>
                      タスクを登録する
                    </span>
                  </p>
                )}
              </Collapse>
            </div>
          );
        })}
        <div className={styles.complete}>
          <p className={styles.deadlineText}>{project.deadline.format()}</p>
          <p className={styles.completionText}>
            <span className={styles.emoticon}>🎯</span>
            目標地点
          </p>
        </div>
        {orphans.length ? (
          <>
            <div className={styles.delimiter}></div>
            <div className={styles.delimiter}></div>
            <div className={styles.milestone}>
              <Collapse
                maxHeight={orphans.length * rowHeight}
                showMoreText={`子タスクを確認する (${orphans.length}件)`}
                header={
                  <h2 className={styles.milestoneTitle}>
                    <div className={styles.milestoneTitleText}>
                      <Icon
                        className={styles.milestoneTitleIcon}
                        name="unknown"
                      />
                      未分類
                    </div>
                  </h2>
                }>
                <TaskTable data={orphans} />
              </Collapse>
            </div>
          </>
        ) : null}
        <div className={styles.footer}></div>
      </div>
    </CheckContainer>
  );
}
