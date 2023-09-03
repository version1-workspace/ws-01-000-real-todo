"use client";
import dayjs from "dayjs";
import { useState } from "react";
import styles from "@/app/main/projects/new/page.module.css";
import Button from "@/components/common/button";
import { Project } from "@/services/api/models/project";
import { builder } from "@/services/api/models";
import GoalForm from "@/components/project/forms/goal";
import MilestoneForm from "@/components/project/forms/milestone";
import ConfirmForm from "@/components/project/forms/confirm";
import CompleteForm from "@/components/project/forms/complete";
import Validator, { Errors } from "@/models/validator";
import { FormContext } from "./context";

interface StepParams {
  label: string;
  skippable?: boolean;
}

const steps = [
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
    onNext: (_project: Project) => {

    }
  },
  {
    label: "完了",
    submitLabel: "プロジェクト詳細へ",
    onNext: (_project: Project) => {

    }
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
            <li className={styles.step}>
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

export default function ProjectsNew() {
  const [index, setIndex] = useState(0);
  const [errors, setErrors] = useState<undefined | Errors>();
  const [project, setProject] = useState<Project>(
    builder.project({
      name: "",
      deadline: dayjs().format("YYYY-MM-DD"),
      slug: "",
      goal: "",
      shouldbe: "",
      milestones: [],
      status: "initial",
      createdAt: dayjs().format("YYYY-MM-DD"),
      updatedAt: dayjs().format("YYYY-MM-DD"),
    }),
  );

  const step = steps[index];

  return (
    <FormContext.Provider
      value={{ project, errors, mutations: { setProject, setErrors } }}>
      <div className={styles.container}>
        <h2>プロジェクト作成</h2>
        <div className={styles.content}>
          <Steps steps={steps} index={index} />
          <div className={styles.body}>
            <div className={styles.form}>
              {[<GoalForm />, <MilestoneForm />, <ConfirmForm />, <CompleteForm />][index]}
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.left}>
              <div>
                {index !== 0 ? (
                  <Button onClick={() => setIndex((index) => index - 1)}>
                    戻る
                  </Button>
                ) : null}
              </div>
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
                    onClick={() => {
                      if (step.validation) {
                        const validator = step.validation(project);

                        if (!validator.valid) {
                          setErrors(validator.errors);
                          return;
                        }
                      }

                      setErrors(undefined);
                      step.onNext?.(project)
                      if (index < steps.length - 1) {
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
