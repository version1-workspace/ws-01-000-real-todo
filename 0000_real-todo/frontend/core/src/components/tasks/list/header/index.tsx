import { useMemo } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/navigation";
import FilterForm from "@/components/tasks/filterForm";
import api from "@/services/api";
import { Filter } from "@/components/tasks/list/hooks/useFilter";
import { IoCloseCircle as Close } from "react-icons/io5";
import { ja } from "@/lib/transltate";
import useTasks from "@/contexts/tasks";
import useProjects from "@/contexts/projects";
import Icon from "@/components/shared/icon";
import useCheck from "@/contexts/check";
import PopupMenu, { Action } from "@/components/shared/popupMenu";
import { useToast } from "@/lib/toast/hook";

const taskTranslations = ja.derive("task")!;
const taskStatuses = ja.derive("task.status")!;

interface Actions {
  onComplete: () => void;
  onArchive: () => void;
  onReopen: () => void;
}

const getActions = ({ onComplete, onArchive, onReopen }: Actions) =>
  (
    [
      {
        key: "reopen",
        logo: <Icon name="undo" className={styles.logo} />,
        text: "未完了にする",
        onClick: onReopen,
      },
      {
        key: "complete",
        logo: <Icon name="complete" className={styles.logo} />,
        text: "完了にする",
        onClick: onComplete,
      },
      {
        key: "archive",
        logo: <Icon name="archive" className={styles.logo} />,
        text: "アーカイブ",
        danger: true,
        onClick: onArchive,
      },
    ] as Action[]
  ).filter((it) => !it.hidden);

interface TaskListHeaderProps {
  filter: Filter;
}

const TaskListHeader = ({ filter }: TaskListHeaderProps) => {
  const { checked, ids: checkedIds } = useCheck();
  const { projects } = useProjects();
  const toast = useToast();
  const {
    date,
    order,
    text,
    projectId,
    statuses,
    isDateSet,
    replica,
    update,
    reset,
    resetState,
    save,
  } = filter;
  const { data, fetch } = useTasks();
  const project = useMemo(
    () => projects.find((it) => projectId === it.id),
    [projects, projectId],
  );

  if (!data) {
    return null;
  }

  const showActionMenu = () => {};
  const resetField = (key: string) => {
    const params = resetState(key as any);
    fetch({ ...params, page: 1 });
  };

  return (
    <div className={styles.header}>
      <div className={styles.control}>
        <div className={styles.number}>
          <div className={styles.pageIndex}>
            <span>
              {data.page} / {data.pageCount}
            </span>
          </div>
          <div className={styles.displayPageCount}>
            <label>表示件数 : </label>
            <select
              onChange={(e) => {
                const limit = Number(e.target.value);
                const newValues = { ...replica, limit };
                update({ ...newValues });
                save(newValues);
                fetch({ ...newValues, page: 1 });
              }}
              value={replica.limit}>
              <option value="20">20 件</option>
              <option value="50">50 件</option>
              <option value="100">100 件</option>
            </select>
          </div>
          <div className={styles.pageCount}>
            <span className={styles.total}>{data.total} 件</span>
          </div>
        </div>
        <div className={styles.layout}>
          <div className={styles.filterStates}>
            <span className={styles.filterState}>
              <label>プロジェクト: </label>
              {project?.name || "指定なし"}
              <div
                className={styles.close}
                onClick={() => resetField("projectId")}>
                <Icon name="close" size="12px" />
              </div>
            </span>
            <span className={styles.filterState}>
              <label>ステータス: </label>
              {Object.keys(statuses || {})
                .map((key) => taskStatuses.t(key))
                .join("、") || "なし"}
              <div
                className={styles.close}
                onClick={() => resetField("statuses")}>
                <Icon name="close" size="12px" />
              </div>
            </span>
            <span className={styles.filterState}>
              <label>タスク名: </label>
              {text || "なし"}
              <div className={styles.close} onClick={() => resetField("text")}>
                <Icon name="close" size="12px" />
              </div>
            </span>
            {isDateSet ? (
              <span className={styles.filterState}>
                <label>{taskTranslations.t(date.type)} : </label>
                {date.start} ~ {date.end}
                <div
                  className={styles.close}
                  onClick={() => resetField("date")}>
                  <Close size="12px" />
                </div>
              </span>
            ) : null}
            <span className={styles.filterState}>
              <label>並び替え: </label>
              {taskTranslations.t(order.type)}
              {order.value === "asc" ? (
                <Icon name="down" />
              ) : (
                <Icon name="up" />
              )}
              <div className={styles.close} onClick={() => resetField("order")}>
                <Icon name="close" size="12px" />
              </div>
            </span>
          </div>
          <div className={styles.controller}>
            <FilterForm
              trigger={
                <div className={styles.display}>
                  <Icon name="filter" />
                  <p>絞り込み</p>
                </div>
              }
              value={replica}
              onShow={() => {
                reset();
              }}
              onSubmit={async () => {
                save();
                await fetch({
                  ...replica,
                  page: 1,
                });
              }}
              onChange={update}
              onCancel={() => {
                reset();
              }}
            />
            {Object.keys(checked).length ? (
              <PopupMenu
                actions={getActions({
                  onComplete: async () => {
                    if (
                      !confirm("選択したタスクを完了しますがよろしいですか？")
                    ) {
                      return;
                    }

                    try {
                      await api.bulkCompleteTask({ ids: checkedIds });
                      toast.success("選択したタスクを完了しました。");
                      fetch({ ...replica, page: 1 });
                    } catch {
                      toast.error("タスクの完了に失敗しました。");
                    }
                  },
                  onArchive: async () => {
                    if (
                      !confirm(
                        "選択したタスクをアーカイブしますがよろしいですか？",
                      )
                    ) {
                      return;
                    }

                    try {
                      await api.bulkArchiveTask({ ids: checkedIds });
                      toast.success("選択したタスクをアーカイブしました。");
                      fetch({ ...replica, page: 1 });
                    } catch {
                      toast.error("タスクのアーカイブに失敗しました。");
                    }
                  },
                  onReopen: async () => {
                    if (
                      !confirm(
                        "選択したタスクを未完了にしますがよろしいですか？",
                      )
                    ) {
                      return;
                    }

                    try {
                      await api.bulkReopenTask({ ids: checkedIds });
                      toast.success("選択したタスクを未完了にしました。");
                      fetch({ ...replica, page: 1 });
                    } catch {
                      toast.error("タスクの未完了処理に失敗しました。");
                    }
                  },
                })}
                trigger={
                  <div className={styles.action}>
                    <Icon name="menu" onClick={showActionMenu} />
                    <div>
                      <p onClick={showActionMenu}>アクション</p>
                    </div>
                  </div>
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskListHeader;
