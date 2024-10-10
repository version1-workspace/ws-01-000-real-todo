import Icon from "@/components/shared/icon";
import route from "@/lib/route";
import api from "@/services/api";
import { factory } from "@/services/api/models";
import { Task, TaskParams } from "@/services/api/models/task";
import Link from "next/link";
import { useState } from "react";
import styles from "./index.module.css";

export default function Search() {
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const search = async (text: string) => {
    if (text.length <= 1) {
      return;
    }

    const res = await api.fetchTasks({
      search: text,
      limit: 10,
      sortType: "deadline",
      sortOrder: "asc",
      status: ["scheduled"],
    });
    const list = res.data.data.map((it: TaskParams) => factory.task(it));
    setTasks(list);
    setShow(true);
  };

  const close = () => {
    setShow(false);
    setText("");
  };

  return (
    <div className={styles.container}>
      {show ? <div className={styles.overlay} onClick={close}></div> : null}
      <div className={styles.search}>
        <Icon name="search" size={24} color="#94ae9f" />
        <input
          type="text"
          placeholder="タスクタイトルで検索"
          value={text}
          onChange={(e) => {
            const text = e.target.value;
            search(text);
            setText(text);
          }}
        />
      </div>
      <div className={styles.popup}>
        {show ? (
          <ul className={styles.candidates}>
            {tasks.map((task) => {
              return (
                <li key={task.id}>
                  <Link
                    href={route.main.tasks.with(task.id)}
                    className={styles.row}
                    onClick={close}>
                    <div className={styles.task}>
                      <div className={styles.heading}>{task.title}</div>
                      <div className={styles.sub}>
                        <p>{task.project?.name}</p>
                        <p>{task.deadline.format()}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
            {tasks.length === 0 ? (
              <div className={styles.empty}>該当するタスクがありません</div>
            ) : null}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
