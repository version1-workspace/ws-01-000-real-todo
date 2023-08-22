import {
  Project,
  ProjectParams,
  ProjectModel,
} from "@/services/api/models/project";
import {
  Stats,
  StatsParams,
  StatsModel,
} from "@/services/api/models/stats";

interface params<T> {
  _raw: T;
}

const handler = <T>() => ({
  get: function (target: params<T>, name: string) {
    return name in target
      ? target[name as keyof params<T>]
      : target._raw?.[name as keyof T];
  },
});

export const builder = {
  project: (params: ProjectParams) =>
    new Proxy(new ProjectModel(params), handler<ProjectParams>()) as Project,
  stats: (params: StatsParams) =>
    new Proxy(new StatsModel(params), handler<StatsParams>()) as Stats,
};
