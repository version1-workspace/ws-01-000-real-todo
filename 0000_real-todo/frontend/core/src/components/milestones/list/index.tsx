"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { classHelper } from "@/lib/cls";
import TaskTable from "../table";
import Icon from "@/components/common/icon";
import { CheckContainer } from "@/contexts/check";
import useMilestones from "@/hooks/useMilestones";

interface CollapseProps {
  header: React.ReactNode;
  children: React.ReactNode;
  maxHeight: number;
  line?: boolean;
  showMoreText?: string;
}

const Collapse = ({
  line,
  showMoreText,
  maxHeight,
  header,
  children,
}: CollapseProps) => {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.collapseContainer}>
      <div className={styles.collapseHeader}>
        {header}
        <Icon
          className={classHelper({
            [styles.collapseTrigger]: true,
            [styles.collapseTriggerShow]: show,
          })}
          name="chevronDown"
          onClick={() => {
            setShow((show) => !show);
          }}
        />
      </div>
      <div className={styles.collapseContent}>
        <div
          className={classHelper({
            [styles.collapseLine]: true,
            [styles.collapseLineHidden]: !line,
          })}>
          <div className={styles.collapseLineArrow}></div>
        </div>
        <div
          style={
            show
              ? {
                  maxHeight: `${Math.max(maxHeight, 240)}px`,
                }
              : undefined
          }
          className={classHelper({
            [styles.collapseBody]: true,
            [styles.collapseBodyShow]: show,
          })}>
          {!show ? (
            <div className={styles.collapseShowMoreContainer}>
              <div className={styles.collapseShowMore}>
                <p
                  className={styles.collapseShowMoreText}
                  onClick={() => setShow(true)}>
                  {showMoreText || "子タスクを確認する"}
                </p>
                <div
                  className={styles.collapseShowMoreIcon}
                  onClick={() => setShow(true)}>
                  <div className={styles.collapseShowMoreArrow}></div>
                  <div className={styles.collapseShowMoreArrow}></div>
                </div>
              </div>
            </div>
          ) : null}
          {children}
        </div>
      </div>
      {show ? (
        <div className={styles.collapaseHideContainer}>
          <div className={styles.collapseHide}>
            <div
              className={styles.collapseHideIcon}
              onClick={() => setShow(false)}>
              <div className={styles.collapseHideArrow}></div>
              <div className={styles.collapseHideArrow}></div>
            </div>
            <p
              className={styles.collapseHideText}
              onClick={() => setShow(false)}>
              折りたたむ
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

interface Props {
  slug: string;
}

const rowHeight = 60;

export default function MilestoneList({ slug }: Props) {
  const { milestones, orphans, fetch } = useMilestones();

  useEffect(() => {
    fetch({ slug });
  }, []);

  if (!milestones) {
    return null;
  }

  return (
    <CheckContainer>
      <div className={styles.container}>
        {milestones.map((it, index) => {
          return (
            <div className={styles.milestone} key={it.uuid}>
              <Collapse
                line
                showMoreText={`子タスクを確認する (${it.children.length}件)`}
                maxHeight={it.children.length * rowHeight}
                header={
                  <div className={styles.milestoneTitle}>
                    <div className={styles.milestoneTitleText}>
                      <Icon
                        className={styles.milestoneTitleIcon}
                        name="milestone"
                      />
                      <p>{it.title}</p>
                    </div>
                    <p className={styles.deadline}>
                      あと{it.deadline.from()} 日
                      <span className={styles.deadlineDate}>
                        ({it.deadline.format()})
                      </span>
                    </p>
                  </div>
                }>
                <TaskTable data={it.children} />
              </Collapse>
            </div>
          );
        })}
        <div className={styles.complete}>
          <p className={styles.completionText}>
            目標達成 &#x1F389;&#x1F389;&#x1F389;
          </p>
        </div>
        <div className={styles.delimiter}></div>
        <div className={styles.delimiter}></div>
        <div className={styles.milestone}>
          <Collapse
            maxHeight={orphans.length * rowHeight}
            showMoreText={`子タスクを確認する (${orphans.length}件)`}
            header={
              <h2 className={styles.milestoneTitle}>
                <div className={styles.milestoneTitleText}>
                  <Icon className={styles.milestoneTitleIcon} name="unknown" />
                  未分類
                </div>
              </h2>
            }>
            <TaskTable data={orphans} />
          </Collapse>
        </div>
        <div className={styles.footer}></div>
      </div>
    </CheckContainer>
  );
}
