"use client";
import { useState, useEffect } from "react";
import styles from "@/components/tasks/popup/index.module.css";
import {
  IoSearch as Search,
  IoCalendarOutline as Calendar,
  IoSwapVertical as Order,
} from "react-icons/io5";
import {
  Fields,
  FieldTypes,
  OrderType,
} from "@/components/tasks/list/hooks/useFilter";

interface DateParams {
  start?: string;
  end?: string;
  type: FieldTypes;
}

interface OrderParams {
  value: FieldTypes;
  type: OrderType;
}

interface UpdateParams {
  text: string;
  date: DateParams;
  order: OrderParams;
  statuses: { [key: string]: boolean };
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

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const submitButton = e.target.classList.contains(styles.submit);
      const parent = e.target?.closest("." + styles.container);
      if (submitButton || parent) {
        return;
      }

      setShow(false);
      onCancel();
    };

    document.addEventListener("click", (e) => close(e));

    return () => {
      document.removeEventListener("click", (e) => close(e));
    };
  }, [show, setShow]);

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

  const onChangeDateType = (type: FieldTypes) => {
    onChange({
      ...value,
      date: {
        ...value.date,
        type,
      },
    });
  };

  const onChangeOrderType = (type: OrderType) => {
    onChange({
      ...value,
      order: {
        ...value.order,
        type,
      },
    });
  };

  return (
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
            <div className={styles.search}>
              <p className={styles.label}>
                <Search />
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
              <Calendar className={styles.icon} />
              日付
            </p>
            <div>
              <div>
                <p className={styles.date}>
                  <label>
                    開始:
                    <input
                      type="date"
                      placeholder="開始日"
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
                <p className={styles.date}>
                  <label>
                    終了:
                    <input
                      type="date"
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
              <ul className={styles.option}>
                <li className={styles.item}>
                  <label>
                    <input
                      name="date"
                      type="radio"
                      checked={Fields.deadline === value.date.type}
                      onClick={() => {
                        onChangeDateType(Fields.deadline as FieldTypes);
                      }}
                    />
                    締切日
                  </label>
                </li>
                <li className={styles.item}>
                  <label>
                    <input
                      name="date"
                      type="radio"
                      checked={Fields.createdAt === value.date.type}
                      onClick={() => {
                        onChangeDateType(Fields.createdAt as FieldTypes);
                      }}
                    />
                    作成日時
                  </label>
                </li>
                <li className={styles.item}>
                  <label>
                    <input
                      name="date"
                      type="radio"
                      checked={Fields.updatedAt === value.date.type}
                      onClick={() => {
                        onChangeDateType(Fields.updatedAt as FieldTypes);
                      }}
                    />
                    更新日時
                  </label>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <p className={styles.label}>
              <Order className={styles.icon} />
              並び替え
            </p>
            <div>
              <select
                className={styles.order}
                value={value.order.value}
                onChange={(e) => {
                  onChange({
                    ...value,
                    order: {
                      ...value.order,
                      value: e.target.value as FieldTypes,
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
                      value="desc"
                      checked={value.order.type === "desc"}
                      onChange={(e) => {
                        onChangeOrderType(e.target.value as OrderType);
                      }}
                    />
                    降順
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      name="order"
                      type="radio"
                      value="asc"
                      checked={value.order.type === "asc"}
                      onChange={(e) => {
                        onChangeOrderType(e.target.value as OrderType);
                      }}
                    />
                    昇順
                  </label>
                </li>
              </ul>
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
  );
}
