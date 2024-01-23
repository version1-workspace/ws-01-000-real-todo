"use client";
import { useEffect, useState } from "react";
import styles from "@/components/tasks/list/index.module.css";
import api from "@/services/api";
import { Task, TaskParams } from "@/services/api/models/task";
import { Pagination } from "@/services/api/models/pagination";
import TaskItem from "@/components/tasks/item";
import Popup from "@/components/tasks/popup";
import TaskForm from "@/components/tasks/form";
import useFilter, {
  Params as FilterParams,
} from "@/components/tasks/list/hooks/useFilter";
import {
  IoListOutline as Layout,
  IoChevronForward as Forward,
  IoChevronBack as Back,
  IoArrowUpOutline as Up,
  IoArrowDownOutline as Down,
  IoCloseCircle as Close,
} from "react-icons/io5";
import { classHelper } from "@/lib/cls";
import { ja } from "@/lib/transltate";
import { factory } from "@/services/api/models";
import { useModal } from "@/lib/modal";

const taskStatuses = ja.derive("task.status")!;

export default function TaskList() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<Pagination<Task>>();
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
  const { open, hide } = useModal();

  const fetch = async ({
    page,
    statuses,
  }: { page?: number } & Partial<FilterParams>) => {
    const res = await api.fetchTasks({
      page: page || 1,
      status: Object.keys(statuses || {}),
    });
    const { data: tasks, pageInfo } = res.data;
    const list = tasks.map((it: TaskParams) => factory.task(it));
    setData(
      new Pagination<Task>({
        list,
        pageInfo,
      }),
    );
  };

  useEffect(() => {
    fetch(replica);
  }, []);

  if (!data) {
    return null;
  }

  const showPopup = () => {
    if (show) {
      return;
    }

    reset();
    setShow(true);
  };

  return (
    <div className={styles.container}>
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
                  onClick={() => resetState("statuses")}>
                  <Close size="12px" />
                </div>
              </span>
              <span className={styles.filterState}>
                <label>フィルタ: </label>
                {text || "なし"}
                <div
                  className={styles.close}
                  onClick={() => resetState("text")}>
                  <Close size="12px" />
                </div>
              </span>
              {isDateSet ? (
                <span className={styles.filterState}>
                  <label>{date.typeLabel} : </label>
                  {date.start} ~ {date.end}
                  <div
                    className={styles.close}
                    onClick={() => resetState("date")}>
                    <Close size="12px" />
                  </div>
                </span>
              ) : null}
              <span className={styles.filterState}>
                <label>並び替え: </label>
                {order.label}
                {order.type === "asc" ? <Up /> : <Down />}
                <div
                  className={styles.close}
                  onClick={() => resetState("order")}>
                  <Close size="12px" />
                </div>
              </span>
            </div>
            <p className={styles.controller}>
              <Layout onClick={showPopup} />
              <div>
                <p onClick={showPopup}>表示</p>
                <Popup
                  show={show}
                  value={replica}
                  onSubmit={() => {
                    save();
                    fetch(replica);
                    setShow(false);
                  }}
                  onChange={update}
                  onCancel={() => {
                    reset();
                    fetch(replica);
                    setShow(false);
                  }}
                />
              </div>
            </p>
          </div>
        </div>
      </div>
      <ul>
        {data.list.map((it, index) => {
          return (
            <li key={it.id}>
              <TaskItem
                data={it}
                containerStyle={
                  index % 2 !== 0
                    ? {
                        background: "#f9f9fd",
                      }
                    : {}
                }
                onComplete={(task: Task) => {
                  const newData = data.set(index, task.complete());
                  api.completeTask({ id: task.id });
                  setData(newData);
                }}
                onReopen={(task: Task) => {
                  const newData = data.set(index, task.reopen());
                  api.reopenTask({ id: task.id });
                  setData(newData);
                }}
                onEdit={() => {
                  open({
                    content: (
                      <TaskForm
                        title="タスクを編集"
                        onSubmit={hide}
                        onCancel={hide}
                      />
                    ),
                  });
                }}
                onArchive={(task: Task) => {
                  const newData = data.set(index, task.archive());
                  api.archiveTask({ id: task.id });
                  setData(newData);
                }}
              />
            </li>
          );
        })}
        {data.list.length === 0 ? (
          <li>
            <p className={styles.empty}>タスクが未登録です。</p>
          </li>
        ) : null}
      </ul>
      <div className={styles.footer}>
        <ul className={styles.pagination}>
          <li
            className={styles.page}
            onClick={() => {
              if (!data.hasPrevious) {
                return;
              }
              fetch({ page: data.page - 1, ...replica });
            }}>
            <Back />
          </li>
          {new Array(data.pageCount).fill("").map((_, index) => {
            return (
              <li
                className={classHelper({
                  [styles.page]: true,
                  [styles.active]: data.page === index + 1,
                })}
                key={`pagination-${index}`}
                onClick={() => {
                  if (index + 1 === data.page) {
                    return;
                  }
                  fetch({ page: index + 1, ...replica });
                }}>
                {index + 1}
              </li>
            );
          })}
          <li
            className={styles.page}
            onClick={() => {
              if (!data.hasNext) {
                return;
              }

              fetch({ page: data.page + 1, ...replica });
            }}>
            <Forward />
          </li>
        </ul>
      </div>
    </div>
  );
}
