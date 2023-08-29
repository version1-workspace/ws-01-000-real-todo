"use client";
import { useEffect, useState } from "react";
import styles from "@/components/tasks/list/index.module.css";
import api from "@/services/api";
import { Task } from "@/services/api/models/task";
import { Pagination } from "@/services/api/models/pagination";
import TaskItem from "@/components/tasks/item";
import Popup from "@/components/tasks/popup";
import useFilter from "@/components/tasks/list/hooks/useFilter";
import {
  IoListOutline as Layout,
  IoChevronForward as Forward,
  IoChevronBack as Back,
  IoArrowUpOutline as Up,
  IoArrowDownOutline as Down,
  IoCloseCircle as Close,
} from "react-icons/io5";
import { classHelper } from "@/lib/cls";

export default function TaskList() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<Pagination<Task>>();
  const {
    date,
    order,
    text,
    isDateSet,
    replica,
    update,
    reset,
    resetState,
    save,
  } = useFilter();

  const fetch = async ({ page }: { page: number }) => {
    const res = await api.fetchTasks({ page });
    setData(res.data);
  };

  useEffect(() => {
    fetch({ page: 1 });
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
          <div className={styles.filterStates}>
            <span className={styles.filterState}>
              <label>フィルタ: </label>
              {text || "なし"}
              <div className={styles.close} onClick={() => resetState("text")}>
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
              <div className={styles.close} onClick={() => resetState("order")}>
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
                  setShow(false);
                }}
                onChange={update}
                onCancel={() => {
                  reset();
                  setShow(false);
                }}
              />
            </div>
          </p>
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
                  debugger
                  const newData = data.set(index, task.complete());
                  setData(newData);
                }}
                onReopen={(task: Task) => {
                  const newData = data.set(index, task.reopen());
                  setData(newData);
                }}
              />
            </li>
          );
        })}
      </ul>
      <div className={styles.footer}>
        <ul className={styles.pagination}>
          <li
            className={styles.page}
            onClick={() => {
              if (!data.hasPrevious) {
                return;
              }
              fetch({ page: data.page - 1 });
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
                  fetch({ page: index + 1 });
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

              fetch({ page: data.page + 1 });
            }}>
            <Forward />
          </li>
        </ul>
      </div>
    </div>
  );
}
