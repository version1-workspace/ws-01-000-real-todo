"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useForm from "@/app/main/projects/new/context";
import Button from "@/components/shared/button";
import Icon from "@/components/shared/icon";
import route from "@/lib/route";
import styles from "./index.module.css";

export default function Complete() {
  const router = useRouter();
  const { project } = useForm();

  return (
    <div className={styles.container}>
      <div className={styles.visual}>
        <Image
          src="/assets/complete-project-create.png"
          width={400}
          height={640}
          alt="プロジェクト作成完了"
          className={styles.visualImage}
          priority
        />
      </div>
      <div className={styles.message}>
        <h2 className={styles.title}>
          プロジェクト作成が<span>完了</span>しました！
        </h2>
        <p>プロジェクトの作成が完了しました！！</p>
        <p>プロジェクトページからさらに詳細を決めましょう。</p>
      </div>
      <div className={styles.nextStep}>
        <div className={styles.nextStepIcon}>
          <Icon name="task" size="32px" color="var(--primary-color)" />
        </div>
        <div className={styles.nextStepBody}>
          <h3>次のステップ</h3>
          <p>
            プロジェクトの詳細設定やメンバーの招待、タスクの作成などを行い、
          </p>
          <p>プロジェクトをスムーズに進めていきましょう。</p>
        </div>
      </div>
      <Button
        className={styles.detailButton}
        variant="primary"
        onClick={() => router.push(route.main.projects.with(project.slug))}
      >
        <span className={styles.detailButtonContent}>
          プロジェクト詳細へ
          <Icon name="arrowForward" size="20px" />
        </span>
      </Button>
    </div>
  );
}
