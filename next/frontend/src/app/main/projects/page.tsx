"use client";
import { useEffect, useState } from "react";
import route from "@/lib/route";
import Card from "@/components/project/card";
import styles from "./page.module.css";
import { useProjectsWithoutContext } from "@/contexts/projects";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import { useSearchParams } from "next/navigation";
import {useRouter} from "next/navigation";

export default function Projects() {
  const { fetch, data } = useProjectsWithoutContext();
  const router = useRouter()
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const [status, setStatus] = useState(["active"]);

  useEffect(() => {
    fetch({
      page: Number(page) || 1,
      limit: 10,
      status,
    });
  }, [page]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>プロジェクト</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.projectsHeader}>
            <p>
              {data.page} / {data.pageCount} ({data.total} 件)
            </p>
            <p className={styles.toggleArchive}>
              <label>
                <input
                  type="checkbox"
                  checked={status.includes("archived")}
                  onChange={() => {
                    if (status.includes("archived")) {
                      setStatus(["active"]);
                      fetch({
                        limit: data.pageInfo.limit,
                        page: 1,
                        status: ["active"],
                      });
                      return;
                    }

                    fetch({
                      limit: data.pageInfo.limit,
                      page: 1,
                      status: ["active", "archived"],
                    });
                    setStatus(["active", "archived"]);
                  }}
                />
                アーカイブを含む
              </label>
            </p>
          </div>
          <ul>
            {data.list.map((it) => {
              return (
                <li key={it.id}>
                  <Link href={route.main.projects.with(it.slug)}>
                    <Card data={it} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.footer}>
          <Pagination
            page={data.page}
            pageCount={data.pageCount}
            hasNext={data.hasNext}
            hasPrevious={data.hasPrevious}
            onFetch={(page: number) => {
              router.push(route.main.projects.with(`?page=${page}`))
            }}
          />
        </div>
      </div>
    </div>
  );
}
