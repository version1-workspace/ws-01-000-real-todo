import mockApi from "./mock"
import { apiClient, getAccessToken, getUserId, setUserId } from "./client"
import {
  deleteAuthRefresh,
  getProjectsSlugMilestones,
  getUsersMe,
  getUsersProjects,
  getUsersProjectsSlug,
  getUsersTasks,
  getUsersTasksId,
  patchUsersProjectsSlug,
  patchUsersProjectsSlugArchive,
  patchUsersProjectsSlugReopen,
  patchUsersTasksId,
  postAuthLogin,
  postAuthRefresh,
  postUsersProjects,
  postUsersTasks,
  putBulkTasksArchive,
  putBulkTasksComplete,
  putBulkTasksReopen,
  putProjectsSlugMilestonesIdArchive,
  putUsersTasksIdArchive,
  putUsersTasksIdComplete,
  putUsersTasksIdReopen,
} from "./generated"

const client = apiClient

type SuccessStatus = 200 | 201 | 202 | 204
type SuccessResponse<T extends { status: number }> =
  Extract<T, { status: SuccessStatus }> extends never
    ? T
    : Extract<T, { status: SuccessStatus }>
type CompatibleResponse = {
  data: any
  status: number
  headers: Headers
}

const unwrapSuccess = <T extends { status: number }>(request: Promise<T>) => {
  return request as Promise<SuccessResponse<T>>
}

const wrap = async <
  T extends { data: unknown; status: number; headers: Headers },
>(
  request: Promise<T>,
): Promise<CompatibleResponse> => {
  const response = await unwrapSuccess(request)

  return {
    data: response.data,
    status: response.status,
    headers: response.headers,
  }
}

const api = {
  client,
  refreshToken: ({ uuid }: { uuid: string }) => {
    return wrap(postAuthRefresh({ uuid }))
  },
  logout: () => {
    return wrap(deleteAuthRefresh())
  },
  fetchUser: () => {
    return wrap(getUsersMe())
  },
  createProject: (project: {
    name: string
    slug: string
    deadline: string
    goal: string
    shouldbe?: string
    status: "active"
    milestones: {
      title: string
      deadline: string
    }[]
  }) => {
    return wrap(postUsersProjects(project))
  },
  updateProject: (
    slug: string,
    project: {
      name: string
      slug: string
      deadline: string
      goal: string
      shouldbe?: string
    },
  ) => {
    return wrap(patchUsersProjectsSlug(slug, project))
  },
  fetchProject: ({ slug }: { slug: string }) => {
    return wrap(getUsersProjectsSlug(slug))
  },
  fetchProjects: ({
    limit,
    page,
    status,
  }: Partial<{
    limit: number
    page: number
    status: string[]
  }>) => {
    return wrap(
      getUsersProjects({
        limit,
        page,
        status: status as never,
      }),
    )
  },
  archiveProject({ slug }: { slug: string }) {
    return wrap(patchUsersProjectsSlugArchive(slug))
  },
  reopenProject({ slug }: { slug: string }) {
    return wrap(patchUsersProjectsSlugReopen(slug))
  },
  fetchStats: mockApi.fetchStats,
  fetchTask: ({ id }: { id: string }) => {
    return wrap(getUsersTasksId(id))
  },
  fetchTasks: ({
    page,
    status,
    limit,
    search,
    sortType,
    sortOrder,
    dateFrom,
    dateTo,
    dateType,
    projectId,
  }: Partial<{
    page: number
    status: string[]
    limit: number
    search: string
    sortType: string
    sortOrder: string
    dateFrom: string
    dateTo: string
    dateType: string
    projectId: string
  }>) => {
    return wrap(
      getUsersTasks({
        page,
        "status[]": status as never,
        limit,
        search,
        sortType: sortType as never,
        sortOrder: sortOrder as never,
        dateFrom,
        dateTo,
        dateType: dateType as never,
        projectId,
      }),
    )
  },
  fetchMilestones: ({ slug }: { slug: string }) => {
    return wrap(getProjectsSlugMilestones(slug))
  },
  archiveMilestone: ({ slug, id }: { id: string; slug: string }) => {
    return wrap(putProjectsSlugMilestonesIdArchive(slug, id))
  },
  completeTask: ({ id }: { id: string }) => {
    return wrap(putUsersTasksIdComplete(id))
  },
  reopenTask: ({ id }: { id: string }) => {
    return wrap(putUsersTasksIdReopen(id))
  },
  archiveTask: ({ id }: { id: string }) => {
    return wrap(putUsersTasksIdArchive(id))
  },
  bulkCompleteTask: ({ ids }: { ids: string[] }) => {
    return wrap(putBulkTasksComplete({ ids }))
  },
  bulkArchiveTask: ({ ids }: { ids: string[] }) => {
    return wrap(putBulkTasksArchive({ ids }))
  },
  bulkReopenTask: ({ ids }: { ids: string[] }) => {
    return wrap(putBulkTasksReopen({ ids }))
  },
  createTask: ({
    data,
  }: {
    data: Partial<{
      title: string
      projectId: string
      deadline: string
      startingAt: string
      finishedAt: string
      status: string
      kind: string
    }>
  }) => {
    return wrap(postUsersTasks(data as never))
  },
  updateTask: (
    id: string,
    data: Partial<{
      title: string
      projectId: string
      parentId: string
      deadline: string
      startingAt: string
      finishedAt: string
      status: string
      kind: string
    }>,
  ) => {
    const _data = Object.keys(data).reduce((acc, key) => {
      const v = data[key as keyof typeof data]
      if (["deadline", "startingAt", "finishedAt"].includes(key)) {
        return {
          ...acc,
          [key]: v?.replaceAll("/", "-"),
        }
      }

      return {
        ...acc,
        [key]: v,
      }
    }, {})
    return wrap(patchUsersTasksId(id, _data as never))
  },
  authenticate: async ({
    email,
    password,
    rememberMe,
  }: {
    email: string
    password: string
    rememberMe: boolean
  }) => {
    return wrap(
      postAuthLogin({
        email,
        password,
        rememberMe,
      }),
    )
  },
}

export default api
export { apiClient, getAccessToken, getUserId, setUserId }
export * as generatedApi from "./generated"
