import DateDecorator from "./date";
import { Project, ProjectParams } from "@/services/api/models/project";
import { v4 as uuid } from "uuid";
import { factory } from ".";

const Status = {
  initial: "initial",
  scheduled: "scheduled",
  completed: "completed",
  archived: "archived",
};

type StatusType = keyof typeof Status;

export interface TaskParams {
  title: string;
  status: StatusType;

  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
  startedAt?: string;
  archivedAt?: string;
  startingAt?: string;
  deadline: string;

  project: ProjectParams;

  parent?: TaskParams;
  children: TaskParams[];
}

export interface TaskDateProps {
  createdAt: DateDecorator;
  updatedAt: DateDecorator;
  finishedAt?: DateDecorator;
  startedAt?: DateDecorator;
  archivedAt?: DateDecorator;
  startingAt?: DateDecorator;
  deadline: DateDecorator;
}

export class TaskModel {
  readonly id: string;
  readonly _raw: TaskParams;
  readonly _children: Task[];
  readonly _parent?: Task;
  readonly _project: Project;

  constructor(params: TaskParams) {
    this.id = uuid();
    this._raw = params;

    this._children = params.children?.map((it) => factory.task(it)) || [];
    this._project = factory.project(params.project);

    if (params.parent) {
      this._parent = factory.task(params.parent);
    }
  }

  get raw() {
    return this._raw;
  }

  get children() {
    return this._children;
  }

  get parent() {
    return this._parent;
  }

  get project() {
    return this._project;
  }

  get isPersist() {
    return this._raw.status !== Status.initial;
  }

  get isArchived() {
    return this._raw.status === "archived";
  }

  get isCompleted() {
    return this._raw.status === "completed";
  }

  params(): TaskParams | undefined {
    if (!this._raw) {
      return;
    }

    return {
      ...JSON.parse(
        JSON.stringify(this._raw, Object.getOwnPropertyNames(this._raw)),
      ),
      parent: this._raw.project,
    };
  }

  withDeadline(value: string): Task | undefined {
    const params = this.params();
    if (!params) {
      return;
    }

    params.deadline = value;

    return factory.task(params);
  }

  withTitle(value: string): Task | undefined {
    const params = this.params();
    if (!params) {
      return;
    }

    params.title = value;

    return factory.task(params);
  }

  scheduled() {
    return this.updateStatus("scheduled");
  }

  complete() {
    return this.updateStatus("completed");
  }

  archive() {
    return this.updateStatus("archived");
  }

  reopen() {
    return this.updateStatus("scheduled");
  }

  private updateStatus(status: StatusType) {
    const raw = {
      ...this._raw,
      status,
    };

    return factory.task(raw);
  }
}

export type Task = TaskParams & TaskModel & TaskDateProps;
