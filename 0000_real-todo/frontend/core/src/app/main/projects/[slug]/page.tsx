"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { factory } from "@/services/api/models";
import { Project } from "@/services/api/models/project";
import styles from "./page.module.css";
import { join } from "@/lib/cls";
import Icon from "@/components/shared/icon";
import route from "@/lib/route";
import TaskForm from "@/components/tasks/form";
import TextInput from "@/components/shared/input/text";
import MilestoneList from "@/components/milestones/list";
import PopupMenu from "@/components/shared/popupMenu";
import { useModal } from "@/lib/modal";
import { useToast } from "@/lib/toast/hook";
import useProjects from "@/contexts/projects";
import ProjectForm from "@/components/project/form";

interface Props {
  params: {
    slug: string;
  };
}

const projectActions = ({
  project,
  onEdit,
  onArchive,
  onReopen,
}: {
  project?: Project;
  onEdit: () => void;
  onArchive: () => Promise<void>;
  onReopen: () => Promise<void>;
}) => [
  {
    key: "edit",
    text: "プロジェクト情報を編集する",
    logo: <Icon name="edit" />,
    onClick: onEdit,
  },
  project?.isArchived
    ? {
        key: "reopen",
        text: "プロジェクトを元に戻す",
        logo: <Icon name="undo" />,
        danger: true,
        onClick: onReopen,
      }
    : {
        key: "archive",
        text: "プロジェクトをアーカイブする",
        logo: <Icon name="archive" />,
        danger: true,
        onClick: onArchive,
      },
];

export default function Project({ params: { slug } }: Props) {
  const [project, setProject] = useState<Project>();
  const { refetch: refetchGlobalProjects } = useProjects();
  const { open, hide } = useModal();
  const toast = useToast();

  const fetch = useCallback(
    async ({ slug }: { slug: string }) => {
      const res = await api.fetchProject({ slug });
      const item = factory.project(res.data);

      setProject(item);
    },
    [slug],
  );

  const actions = useMemo(
    () =>
      projectActions({
        project,
        onEdit: () => {
          open({
            content: (
              <ProjectForm
                title="プロジェクトを編集"
                data={project}
                onSubmit={(form) => {
                  refetchGlobalProjects();
                  fetch({ slug: form.slug });
                  if (project?.slug !== form.slug) {
                    history.replaceState(
                      null,
                      "",
                      route.main.projects.with(form.slug),
                    );
                  }

                  hide();
                }}
                onCancel={hide}
              />
            ),
          });
        },
        onReopen: async () => {
          if (!project) {
            return;
          }

          try {
            await api.reopenProject({ slug: project.slug });
            toast.success("プロジェクトを元に戻しました");
            await refetchGlobalProjects();
          } catch {
            toast.error("アーカイブに失敗しました");
          }
        },
        onArchive: async () => {
          if (!project) {
            return;
          }

          if (!confirm("プロジェクトをアーカイブしますがよろしいですか？")) {
            return;
          }

          try {
            await api.archiveProject({ slug: project.slug });
            toast.success("プロジェクトをアーカイブしました");
            await refetchGlobalProjects();
          } catch {
            toast.error("アーカイブに失敗しました");
          }
        },
      }),
    [toast, project, fetch, refetchGlobalProjects],
  );

  useEffect(() => {
    fetch({ slug });
  }, []);

  if (!project) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.body}>
          <div className={styles.project}>
            <div className={styles.header}>
              <h1 className={styles.title}>
                {project.isArchived ? "（アーカイブ）" : null}
                {project.name}
              </h1>
              <div className={styles.menu}>
                <PopupMenu
                  trigger={<Icon name="menu" interactive="pulse" />}
                  actions={actions}
                />
              </div>
            </div>
            <div className={styles.projectBody}>
              <div className={styles.field}>
                <label className={styles.label}>
                  <span className={styles.labelText}>ゴール: </span>
                </label>
                <div className={styles.goalContainer}>
                  <p className={styles.deadline}>
                    <span className={styles.fromText}>
                      あと {project.deadline?.from()} 日
                    </span>
                    <span className={styles.fromDate}>
                      ({project.deadline?.format()})
                    </span>
                  </p>
                  <p className={join(styles.text, styles.goal)}>
                    {project.goal}
                  </p>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  <span className={styles.labelText}>あるべき姿: </span>
                </label>
                <p className={styles.text}>{project.shouldbe}</p>
              </div>
              <div className={styles.border}></div>
              <div className={styles.field}>
                <label className={styles.label}>スラッグ: </label>
                <p className={join(styles.text, styles.slug)}>
                  <span className={styles.slugBasePath}>
                    {route.main.projects.with("")}
                  </span>
                  <TextInput value={project.slug} />
                </p>
              </div>
              <div className={styles.field}>
                {project.stats ? (
                  <ul className={styles.stats}>
                    <li>
                      <div className={styles.stat}>
                        <Icon name="calendar" className={styles.statIcon} />
                        {project.stats.states.scheduled}
                      </div>
                    </li>
                    <li>
                      <div className={styles.stat}>
                        <Icon name="complete" className={styles.statIcon} />{" "}
                        {project.stats.states.completed}
                      </div>
                    </li>
                    <li>
                      <div className={join(styles.stat, styles.lastStat)}>
                        <Icon name="archive" className={styles.statIcon} />{" "}
                        {project.stats.states.archived}
                      </div>
                    </li>
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
          <div className={styles.milestoneListHeader}>
            <div
              className={styles.addMilestone}
              onClick={() => {
                open({
                  content: (
                    <TaskForm
                      title="マイルストーンを追加"
                      data={factory.task({
                        uuid: "",
                        title: "",
                        kind: "milestone" as const,
                        description: "",
                        status: "scheduled" as const,
                        project,
                        createdAt: "",
                        updatedAt: "",
                        deadline: "",
                        parent: undefined,
                        children: [],
                      })}
                      onSubmit={() => {
                        hide();
                      }}
                      onCancel={hide}
                    />
                  ),
                });
              }}>
              <Icon name="add" />
              <p>マイルストーンを追加する</p>
            </div>
          </div>
          <div className={styles.milestoneList}>
            <MilestoneList project={project} />
          </div>
        </div>
      </div>
    </div>
  );
}
