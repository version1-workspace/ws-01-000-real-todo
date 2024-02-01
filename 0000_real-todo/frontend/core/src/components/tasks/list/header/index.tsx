import { useState } from "react";
import styles from "@/components/tasks/list/index.module.css";
import Popup from "@/components/tasks/popup";
import api from "@/services/api";
import useFilter from "@/components/tasks/list/hooks/useFilter";
import { IoCloseCircle as Close } from "react-icons/io5";
import { ja } from "@/lib/transltate";
import useTasks from "@/hooks/useTask";
import Icon from "@/components/common/icon";
import useCheck from "@/hooks/useCheck";
import PopupMenu, { Action } from "../../popupMenu";
import { useToast } from "@/lib/toast/hook";

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
        text: "完了する",
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

interface TaskListHeaderProps {}

const TaskListHeader = ({}: TaskListHeaderProps) => {
  const { checked, ids: checkedIds } = useCheck();
  const toast = useToast();
  const [displayCount, setDisplayCount] = useState<number>(10);
  const {
    date,
    order,
    text,
    statuses,
    isDateSet,
    replica,
    update,
    reset,
    resetState,
    save,
  } = useFilter();
  const { data, fetch } = useTasks();

  if (!data) {
    return null;
  }

  const showActionMenu = () => {};
  const resetField = (key: string) => {
    const params = resetState(key as any)
    fetch(params)
  }

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
              onChange={(e) => setDisplayCount(Number(e.target.value))}
              value={displayCount}>
              <option value="10">10 件</option>
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
              <label>フィルタ: </label>
              {text || "なし"}
              <div className={styles.close} onClick={() => resetField("text")}>
                <Icon name="close" size="12px" />
              </div>
            </span>
            {isDateSet ? (
              <span className={styles.filterState}>
                <label>{date.typeLabel} : </label>
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
              {order.label}
              {order.type === "asc" ? <Icon name="up" /> : <Icon name="down" />}
              <div className={styles.close} onClick={() => resetField("order")}>
                <Icon name="close" size="12px" />
              </div>
            </span>
          </div>
          <div className={styles.controller}>
            <Popup
              trigger={
                <div className={styles.display}>
                  <Icon name="layout" />
                  <p>表示</p>
                </div>
              }
              value={replica}
              onShow={() => {
                reset();
              }}
              onSubmit={async () => {
                save();
                await fetch(replica);
              }}
              onChange={update}
              onCancel={() => {
                reset();
                fetch(replica);
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
