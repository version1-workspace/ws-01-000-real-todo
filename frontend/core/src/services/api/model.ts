interface ProjectParams {
  name: string
  deadline: string
  slug: string
  goal: string
  shouldbe: string
  stats: {
    milestone: number
    task: number
    totalTask: number
  }
}

export class ProjectModel {
  _raw?: ProjectParams

  constructor(params: ProjectParams) {
    this._raw = params
  }
}

export type Project = ProjectModel & ProjectParams

const handler = {
  get: function(target: Project, name: string) {
    return name in target ? target[name as keyof Project]: target._raw?.[name as keyof ProjectParams]
  }
}

export const builder = {
  project: (params: ProjectParams) => new Proxy(new ProjectModel(params), handler) as Project,
}
