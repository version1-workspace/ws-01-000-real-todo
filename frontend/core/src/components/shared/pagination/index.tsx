import styles from "./index.module.css";
import { classHelper } from "@/lib/cls";
import Icon from "@/components/shared/icon";

interface Props {
  page: number;
  pageCount: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onFetch?: (page: number) => void;
}

export default function Pagination({
  page,
  pageCount,
  hasNext,
  hasPrevious,
  onFetch,
}: Props) {
  return (
    <ul className={styles.container}>
      <li
        className={styles.page}
        onClick={() => {
          if (!hasPrevious) {
            return;
          }

          if (onFetch) {
            onFetch(page - 1);
          }
        }}>
        <Icon name="back" />
      </li>
      {new Array(pageCount || 0).fill("").map((_, index) => {
        return (
          <li
            className={classHelper({
              [styles.page]: true,
              [styles.active]: page === index + 1,
            })}
            key={`pagination-${index}`}
            onClick={() => {
              if (index + 1 === page) {
                return;
              }

              if (onFetch) {
                onFetch(index + 1);
              }
            }}>
            {index + 1}
          </li>
        );
      })}
      <li
        className={styles.page}
        onClick={() => {
          if (!hasNext) {
            return;
          }

          if (onFetch) {
            onFetch(page + 1);
          }
        }}>
        <Icon name="forward" />
      </li>
    </ul>
  );
}
