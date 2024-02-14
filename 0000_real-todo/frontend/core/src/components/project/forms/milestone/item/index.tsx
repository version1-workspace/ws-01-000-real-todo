"use client";
import { useState } from "react";
import styles from "@/components/project/forms/milestone/item/index.module.css";
import { Task } from "@/services/api/models/task";
import { Project, within } from "@/services/api/models/project";
import { classHelper, join } from "@/lib/cls";
import Validator, { Errors } from "@/models/validator";
import {
  IoCloseOutline as Close,
  IoPencil as Edit,
  IoCheckmark as Save,
  IoTrashOutline as Remove,
} from "react-icons/io5";

interface EditProps {
  active: boolean;
  component: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const validator = new Validator({
  title: {
    label: "タイトル",
    validator: ["required"],
  },
  deadline: {
    label: "期限日",
    validator: [
      "required",
      "date",
      (data: Task) => {
        if (within(data.project, data.deadline)) {
          return;
        }

        return "プロジェクト期限日外です";
      },
    ],
  },
});

function EditForm({ active, component, children, onClick }: EditProps) {
  if (active) {
    return (
      <div className={styles.editContainer} onClick={onClick}>
        {component}
      </div>
    );
  }

  return (
    <div className={styles.editContainer} onClick={onClick}>
      {children}
    </div>
  );
}

interface Props {
  item: Task;
  project: Project;
  readOnly?: boolean;
  className?: string;
  onSave?: (task: Task) => void;
  onRemove?: () => void;
}

export default function MilestoneItem({
  className,
  item,
  project,
  readOnly,
  onRemove,
  onSave,
}: Props) {
  const [errors, setErrors] = useState<Errors | undefined>(undefined);
  const [form, setForm] = useState(item);
  const [editing, setEditing] = useState(false);

  const shouldEdit = editing || !item.isPersist;

  return (
    <div className={join(styles.container, className)}>
      <div className={styles.circle}></div>
      <p className={styles.date}>
        <EditForm
          active={shouldEdit}
          onClick={() => !readOnly && setEditing(true)}
          component={
            <div>
              <input
                type="date"
                value={form.deadline}
                className={join(styles.input, styles.dateInput)}
                onChange={(e) => {
                  setForm(form.withDeadline(e.target.value)!);
                }}
                readOnly={readOnly}
                max={project.deadline?.forHtml}
              />
              <p className={styles.error}>{errors?.deadline}</p>
            </div>
          }>
          <p>{form.deadline.format()}</p>
        </EditForm>
      </p>
      <div className={styles.milestone}>
        <div className={styles.body}>
          <div className={styles.title}>
            <EditForm
              active={shouldEdit}
              onClick={() => !readOnly && setEditing(true)}
              component={
                <div>
                  <input
                    className={styles.input}
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      setForm(form.withTitle(e.target.value)!);
                    }}
                    readOnly={readOnly}
                  />
                  <p className={styles.error}>{errors?.title}</p>
                </div>
              }>
              <p>{form.title}</p>
            </EditForm>
          </div>
          {!readOnly ? (
            <div
              className={classHelper({
                [styles.action]: true,
                [styles.show]: editing,
              })}>
              {shouldEdit ? (
                <Save
                  color="#2e2e2e"
                  size="12px"
                  onClick={() => {
                    const result = validator.validate(form);
                    setErrors(result.errors);
                    if (!result.valid) {
                      return;
                    }

                    setErrors(undefined);
                    setEditing(false);
                    setForm(form.scheduled());
                    onSave?.(form);
                  }}
                />
              ) : (
                <Edit
                  color="#2e2e2e"
                  size="12px"
                  onClick={() => setEditing(true)}
                />
              )}
              {item.isPersist && editing ? (
                <Close
                  color="#2e2e2e"
                  onClick={() => {
                    setEditing(false);
                    setErrors(undefined);
                  }}
                />
              ) : null}
              {!item.isPersist || (item.isPersist && !editing) ? (
                <Remove
                  color="#2e2e2e"
                  onClick={() => {
                    setEditing(false);
                    setErrors(undefined);

                    onRemove?.();
                  }}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
