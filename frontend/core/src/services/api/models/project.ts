import { Task, TaskParams } from "@/services/api/models/task";
import { now } from "@/services/api/models/date";
import { v4 as uuid } from "uuid";
import DateDecorator from "./date";
import { builder } from ".";

const Status = {
  initial: "initial",
  active: "active",
  archived: "archived",
};

type StatusType = keyof typeof Status;

export interface ProjectParams {
  name: string;

  createdAt: string;
  updatedAt: string;
  deadline: string;

  status: StatusType;

  slug: string;
  goal: string;
  shouldbe: string;
  stats?: {
    milestone: number;
    task: number;
    totalTask: number;
  };
  milestones: TaskParams[];
}

export interface ProjectDateProps {
  createdAt: DateDecorator;
  updatedAt: DateDecorator;
  deadline: DateDecorator;
}

export class ProjectModel {
  readonly id: string;
  readonly _raw: ProjectParams;
  readonly _milestones: Task[] = [];

  constructor(params: ProjectParams) {
    this.id = uuid();
    this._raw = params;
    if (params?.milestones) {
      this._milestones = params.milestones.map((it) => builder.task(it));
    } else {
      this._milestones = [];
    }
  }

  get milestones() {
    return this._milestones;
  }

  params(): ProjectParams | undefined {
    if (!this._raw) {
      return;
    }

    const projectParams = JSON.parse(
      JSON.stringify(this._raw, Object.getOwnPropertyNames(this._raw)),
    );

    return {
      ...projectParams,
      milestones: this.milestones.map((it) => it.params()),
    };
  }

  with(
    key: "name" | "slug" | "goal" | "shouldbe",
    value: string,
  ): Project | undefined {
    const params = this.params();
    if (!params) {
      return;
    }

    params[key] = value;

    return builder.project(params);
  }

  withName(value: string) {
    return this.with("name", value);
  }

  withSlug(value: string) {
    return this.with("slug", value);
  }

  withGoal(value: string) {
    return this.with("goal", value);
  }

  withShouldbe(value: string) {
    return this.with("shouldbe", value);
  }

  withDeadline(value: string): Project | undefined {
    const params = this.params();
    if (!params) {
      return;
    }

    params.deadline = value;

    return builder.project(params);
  }

  setMilestone(index: number, milestone: Task): Project | undefined {
    const params = this.params();
    if (!params) {
      return;
    }

    params.milestones[index] = milestone.params()!;

    const project = builder.project(params);
    return project.sortMilestones();
  }

  addMilestone(milestone: Task): Project {
    const milestones = [...this._milestones, milestone].map(
      (it) => it.params()!,
    );

    const project = builder.project({
      ...this._raw!,
      milestones,
    });

    return project.sortMilestones();
  }

  removeMilestone(index: number): Project {
    const milestones = [...this._milestones];
    milestones.splice(index, 1);

    const project = builder.project({
      ...this._raw!,
      milestones,
    });

    return project;
  }

  sortMilestones() {
    const milestones = [...this._milestones].sort((a: Task, b: Task) => {
      return a.deadline.greaterThanEqual(b.deadline) ? -1 : 1;
    });

    const project = builder.project({
      ...this._raw!,
      milestones: milestones.map((it) => it.params()!),
    });

    return project;
  }
}

export type Project = ProjectModel & ProjectParams & ProjectDateProps;

export const within = (project: Project, date: DateDecorator) => {
  const min = now();
  const max = project.deadline;

  return min.lessThanEqual(date) && max.greaterThanEqual(date);
};