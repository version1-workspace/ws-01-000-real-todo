"use client";
import { useState } from "react";
import styles from "@/app/main/projects/new/page.module.css";
import Button from "@/components/shared/button";
import { Project } from "@/services/api/models/project";
import { factory } from "@/services/api/models";
import GoalForm from "@/components/project/forms/goal";
import MilestoneForm from "@/components/project/forms/milestone";
import ConfirmForm from "@/components/project/forms/confirm";
import CompleteForm from "@/components/project/forms/complete";
import Validator, { Errors } from "@/models/validator";
import { FormContext } from "./context";
import { AppDate } from "@/lib/date";
import api from "@/services/api";
import route from "@/lib/route";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast/hook";

interface StepParams {
  label: string;
  skippable?: boolean;
}

interface Router {
  push: (path: string) => void;
}

interface Toast {
  error: (msg: string) => void;
}

const buildSteps = (router: Router, toast: Toast) => [
  {
    label: "ゴール設定",
    validation: (project: Project): Validator<Project> => {
      const validator = new Validator({
        name: {
          label: "プロジェクト名",
          validator: ["required"],
        },
        slug: {
          label: "スラッグ",
          validator: ["required", "alphanumeric"],
        },
        goal: {
          label: "目標",
          validator: ["required"],
        },
        shouldbe: {
          label: "あるべき姿",
          validator: [],
        },
        deadline: {
          label: "期限日",
          validator: ["required", "date"],
        },
      });

      return validator.validate(project);
    },
  },
  {
    label: "マイルストーン設定",
    skippable: true,
  },
  {
    label: "確認",
    submitLabel: "作成",
    onNext: async (project: Project) => {
      try {
        await api.createProject({
          name: project.name,
          slug: project.slug,
          goal: project.goal,
          shouldbe: project.shouldbe,
          status: "active",
          deadline: project.deadline?.forHtml || "",
          milestones: project.milestones.map((it) => {
            return {
              title: it.title,
              deadline: it.deadline?.forHtml || "",
            };
          }),
        });
        return true;
      } catch (e) {
        console.error(e);
        toast.error("プロジェクトの追加に失敗しました。");
        return false;
      }
    },
  },
  {
    label: "完了",
    preventBack: true,
    submitLabel: "プロジェクト詳細へ",
    onNext: async (project: Project) => {
      router.push(route.main.projects.with(project.slug));
    },
  },
];

interface StepsProps {
  index: number;
  steps: StepParams[];
}

function Steps({ index, steps }: StepsProps) {
  return (
    <div className={styles.stepsContainer}>
      <div className={styles.stepsContent}>
        <div className={styles.bar}>
          <p className={styles.barContent}></p>
        </div>
        <ul className={styles.steps}>
          {steps.map((it, number) => (
            <li key={it.label} className={styles.step}>
              <div className={styles.item}>
                <div className={styles.circle}>
                  {index !== number ? <div className={styles.overlay} /> : null}
                  <p>{number + 1}</p>
                </div>
                <div className={styles.textContainer}>
                  <p className={styles.text}>{it.label}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const now = AppDate.now();

export default function ProjectsNew() {
  const router = useRouter();
  const toast = useToast();
  const [index, setIndex] = useState(0);
  const [errors, setErrors] = useState<undefined | Errors>();
  const [project, setProject] = useState<Project>(
    factory.project({
      name: "",
      uuid: "",
      deadline: AppDate.in(90).toString(),
      slug: "",
      goal: "",
      shouldbe: "",
      milestones: [],
      status: "initial",
      createdAt: now.toString(),
      updatedAt: now.toString(),
    }),
  );

  const steps = buildSteps(router, toast);
  const step = steps[index];

  return (
    <FormContext.Provider
      value={{ project, errors, mutations: { setProject, setErrors } }}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>プロジェクト作成</h2>
          </div>
          <Steps steps={steps} index={index} />
          <div className={styles.body}>
            <div className={styles.form}>
              {
                [
                  <GoalForm key="goal" />,
                  <MilestoneForm key="milestone" />,
                  <ConfirmForm key="confirm" />,
                  <CompleteForm key="complete" />,
                ][index]
              }
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.left}>
              {step.preventBack ? null : (
                <div>
                  {index !== 0 ? (
                    <Button onClick={() => setIndex((index) => index - 1)}>
                      戻る
                    </Button>
                  ) : null}
                </div>
              )}
            </div>
            <div className={styles.right}>
              <div className={styles.skip}>
                {step.skippable ? (
                  <Button onClick={() => setIndex((index) => index + 1)}>
                    スキップ
                  </Button>
                ) : null}
              </div>
              <div className={styles.next}>
                <Button
                  variant="primary"
                  onClick={async () => {
                    if (step.validation) {
                      const validator = step.validation(project);

                      if (!validator.valid) {
                        setErrors(validator.errors);
                        return;
                      }
                    }

                    setErrors(undefined);
                    const success = await step.onNext?.(project);
                    if ((!step.onNext || success) && index < steps.length - 1) {
                      setIndex((index) => index + 1);
                    }
                  }}>
                  {step.submitLabel ? step.submitLabel : "次へ"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormContext.Provider>
  );
}
