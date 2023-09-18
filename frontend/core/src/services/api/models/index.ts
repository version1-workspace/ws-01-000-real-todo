import {
  Project,
  ProjectParams,
  ProjectModel,
} from "@/services/api/models/project";
import { Stats, StatsParams, StatsModel } from "@/services/api/models/stats";
import { Task, TaskParams, TaskModel } from "@/services/api/models/task";

import DateDecorater from "@/services/api/models/date";

interface Params<T> {
  _raw: T;
}

interface HandlerParams {
  dateFields?: string[];
}

const handler = <T>({ dateFields }: HandlerParams | undefined = {}) => ({
  get: function (target: Params<T>, name: string) {
    if (name in target) {
      return target[name as keyof Params<T>];
    }

    if (dateFields?.includes(name)) {
      const value = target._raw[name as keyof T]?.toString() || "";
      return new DateDecorater(value);
    }

    return target._raw[name as keyof T];
  },
});

export const factory = {
  project: (params: ProjectParams) =>
    new Proxy(
      new ProjectModel(params),
      handler<ProjectParams>({
        dateFields: ["createdAt", "updatedAt", "deadline"],
      }),
    ) as Project,
  stats: (params: StatsParams) =>
    new Proxy(new StatsModel(params), handler<StatsParams>()) as Stats,
  task: (params: TaskParams) =>
    new Proxy(
      new TaskModel(params),
      handler<TaskParams>({
        dateFields: [
          "createdAt",
          "updatedAt",
          "finishedAt",
          "startingAt",
          "deadline",
        ],
      }),
    ) as Task,
};
