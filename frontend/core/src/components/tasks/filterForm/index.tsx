"use client";
import { useState } from "react";
import styles from "./index.module.css";
import { FieldTypes, OrderType } from "@/components/tasks/list/hooks/useFilter";
import Icon from "@/components/shared/icon";
import useProjects from "@/contexts/projects";

interface DateParams {
  start?: string;
  end?: string;
  type: FieldTypes;
}

interface OrderParams {
  type: FieldTypes;
  value: OrderType;
}

interface UpdateParams {
  text: string;
  projectId?: string;
  date: DateParams;
  order: OrderParams;
  statuses: { [key: string]: boolean };
  limit: number;
  page: number;
}

interface Props {
  trigger: React.ReactNode;
  value: UpdateParams;
  onShow: () => void;
  onSubmit: () => void;
  onChange: (params: UpdateParams) => void;
  onCancel: () => void;
}

export default function Popup({
  value,
  trigger,
  onShow,
  onSubmit,
  onChange,
  onCancel,
}: Props) {
  const [show, setShow] = useState(false);
  const { projects } = useProjects();

  const onChangeStatuses = (status: string) => {
    const newStatuses = { ...value.statuses };
    if (newStatuses[status]) {
      delete newStatuses[status];
    } else {
      newStatuses[status] = true;
    }
    const newValue = {
      ...value,
      statuses: newStatuses,
    };

    onChange(newValue);
  };

  const onChangeOrder = (o: OrderType) => {
    onChange({
      ...value,
      order: {
        ...value.order,
        value: o,
      },
    });
  };

  return (
    <>
      {show ? (
        <div
          className={styles.overlay}
          onClick={() => {
            setShow(false);
            onCancel();
          }}></div>
      ) : null}
      <div className={styles.container}>
        <div
          onClick={() => {
            setShow(true);
            onShow();
          }}>
          {trigger}
        </div>
        {show ? (
          <ul className={styles.content}>
            <li>
              <p className={styles.label}>
                <Icon name="order" className={styles.icon} />
                並び替え
              </p>
              <div>
                <select
                  className={styles.selector}
                  value={value.order.type}
                  onChange={(e) => {
                    onChange({
                      ...value,
                      order: {
                        ...value.order,
                        type: e.target.value as FieldTypes,
                      },
                    });
                  }}>
                  <option value="deadline">締切日順</option>
                  <option value="updatedAt">更新日順</option>
                  <option value="createdAt">作成日順</option>
                </select>
              </div>
              <div>
                <ul className={styles.direction}>
                  <li>
                    <label>
                      <input
                        name="order"
                        type="radio"
                        value="asc"
                        checked={value.order.value === "asc"}
                        onChange={(e) => {
                          onChangeOrder(e.target.value as OrderType);
                        }}
                      />
                      昇順
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        name="order"
                        type="radio"
                        value="desc"
                        checked={value.order.value === "desc"}
                        onChange={(e) => {
                          onChangeOrder(e.target.value as OrderType);
                        }}
                      />
                      降順
                    </label>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div className={styles.project}>
                <p className={styles.label}>
                  <Icon name="folder" className={styles.icon} />
                  プロジェクト
                </p>
                <select
                  className={styles.selector}
                  value={value.projectId}
                  onChange={(e) => {
                    onChange({ ...value, projectId: e.target.value });
                  }}>
                  <option value="">指定なし</option>
                  {projects.map((it) => {
                    return (
                      <option key={it.id} value={it.id}>
                        {it.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </li>
            <li>
              <div className={styles.search}>
                <p className={styles.label}>
                  <Icon name="search" />
                  検索
                </p>
                <input
                  type="text"
                  placeholder="タイトル名で検索"
                  value={value.text}
                  className={styles.searchForm}
                  onChange={(e) => {
                    onChange({
                      ...value,
                      text: e.target.value,
                    });
                  }}
                />
                <div className={styles.statusesContainer}>
                  <p className={styles.statusesLabel}>ステータス : </p>
                  <ul className={styles.statuses}>
                    <li className={styles.status}>
                      <label className={styles.statusLabel}>
                        <input
                          type="checkbox"
                          checked={value.statuses.scheduled}
                          onClick={() => {
                            onChangeStatuses("scheduled");
                          }}
                          readOnly
                        />
                        未完了
                      </label>
                    </li>
                    <li className={styles.status}>
                      <label className={styles.statusLabel}>
                        <input
                          type="checkbox"
                          checked={value.statuses.completed}
                          onClick={() => {
                            onChangeStatuses("completed");
                          }}
                          readOnly
                        />
                        完了
                      </label>
                    </li>
                    <li className={styles.status}>
                      <label className={styles.statusLabel}>
                        <input
                          type="checkbox"
                          checked={value.statuses.archived}
                          onClick={() => {
                            onChangeStatuses("archived");
                          }}
                          readOnly
                        />
                        アーカイブ
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <p className={styles.label}>
                <Icon name="calendar" className={styles.icon} />
                日付
              </p>
              <div>
                <div>
                  <p className={styles.dateFields}>
                    <label>
                      日付種別:
                      <select
                        className={styles.selector}
                        value={value.date.type}
                        onChange={(e) => {
                          onChange({
                            ...value,
                            date: {
                              ...value.date,
                              type: e.target.value as FieldTypes,
                            },
                          });
                        }}>
                        <option value="deadline">締切日</option>
                        <option value="updatedAt">更新日</option>
                        <option value="createdAt">作成日</option>
                      </select>
                    </label>
                  </p>
                  <p className={styles.dateFields}>
                    <label>
                      開始:
                      <input
                        type="date"
                        placeholder="開始日"
                        className={styles.dateFieldsInput}
                        value={value.date.start}
                        onChange={(e) => {
                          onChange({
                            ...value,
                            date: {
                              ...value.date,
                              start: e.target.value,
                            },
                          });
                        }}
                      />
                    </label>
                  </p>
                  <p className={styles.dateFields}>
                    <label>
                      終了:
                      <input
                        type="date"
                        className={styles.dateFieldsInput}
                        value={value.date.end}
                        onChange={(e) => {
                          onChange({
                            ...value,
                            date: {
                              ...value.date,
                              end: e.target.value,
                            },
                          });
                        }}
                      />
                    </label>
                  </p>
                </div>
              </div>
            </li>
            <li className={styles.footer}>
              <button
                className={styles.submit}
                onClick={(e) => {
                  e.stopPropagation();
                  onSubmit();
                  setShow(false);
                }}>
                フィルタ
              </button>
              <button
                className={styles.cancel}
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                  setShow(false);
                }}>
                キャンセル
              </button>
            </li>
          </ul>
        ) : null}
      </div>
    </>
  );
}
