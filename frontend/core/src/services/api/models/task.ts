import DateDecorator from "./date";
import { Project, ProjectModel } from "@/services/api/models/project";
import { builder } from ".";

export interface TaskParams {
  id: number;
  title: string;
  status: string;

  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
  startingAt?: string;
  deadline: string;

  project: Project;

  parent?: TaskParams;
  children: TaskParams[];
}

export interface TaskDateProps {
  createdAt: DateDecorator;
  updatedAt: DateDecorator;
  finishedAt?: DateDecorator;
  startingAt?: DateDecorator;
  deadline: DateDecorator;
}

export class TaskModel {
  readonly _raw: TaskParams;
  readonly _children: TaskModel[];
  readonly _parent?: TaskModel;
  readonly _project: ProjectModel;

  constructor(params: TaskParams) {
    this._raw = params;
    this._children = params.children.map((it) => new TaskModel(it));
    this._project = new ProjectModel(params.project);
    if (params.parent) {
      this._parent = new TaskModel(params.parent);
    }
  }

  get children() {
    return this._children;
  }

  get parent() {
    return this._parent;
  }

  get isArchived() {
    return this._raw.status === "archived";
  }

  get isCompleted() {
    return this._raw.status === "completed";
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

  private updateStatus(status: string) {
    const raw = {
      ...this._raw,
      status,
    };

    return builder.task(raw);
  }
}

export type Task = TaskParams & TaskModel & TaskDateProps;
