export interface ProjectParams {
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
  readonly _raw?: ProjectParams

  constructor(params: ProjectParams) {
    this._raw = params
  }
}

export type Project = ProjectModel & ProjectParams
