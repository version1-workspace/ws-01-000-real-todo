import { type Project, type Tag, type Task, type User } from '../models/prisma.js';

type ProjectWithRelations = Project & {
  tasks?: Task[];
};

type TaskWithRelations = Task & {
  project?: Project | null;
  parent?: Task | null;
  children?: Task[];
  tagTasks?: Array<{
    tag: Tag;
  }>;
};

type SerializedTask = Record<string, unknown>;

export const serializeUser = (user: User) => ({
  uuid: user.uuid,
  username: user.username,
  email: user.email,
  status: user.status,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

export const serializeTag = (tag: Tag) => ({
  id: tag.id,
  uuid: tag.uuid,
  name: tag.name,
  status: tag.status,
  userId: tag.userId,
  createdAt: tag.createdAt.toISOString(),
  updatedAt: tag.updatedAt.toISOString(),
});

const serializeProjectBase = (project: Project) => ({
  id: project.id,
  uuid: project.uuid,
  name: project.name,
  status: project.status,
  deadline: project.deadline.toISOString(),
  startingAt: project.startingAt?.toISOString() ?? null,
  startedAt: project.startedAt?.toISOString() ?? null,
  archivedAt: project.archivedAt?.toISOString() ?? null,
  finishedAt: project.finishedAt?.toISOString() ?? null,
  slug: project.slug,
  goal: project.goal,
  shouldbe: project.shouldbe ?? null,
  userId: project.userId,
  createdAt: project.createdAt.toISOString(),
  updatedAt: project.updatedAt.toISOString(),
});

export const serializeProject = (
  project: Project,
  extras?: {
    milestones?: ReturnType<typeof serializeTask>[];
    stats?: {
      total: number;
      kinds: Record<string, number>;
      states: Record<string, number>;
    };
  },
) => ({
  ...serializeProjectBase(project),
  milestones: extras?.milestones ?? [],
  stats:
    extras?.stats ??
    ({
      total: 0,
      kinds: { milestone: 0, task: 0 },
      states: { scheduled: 0, completed: 0, archived: 0 },
    } satisfies {
      total: number;
      kinds: Record<string, number>;
      states: Record<string, number>;
    }),
});

export const serializeTask = (
  task: TaskWithRelations,
  options?: {
    includeProject?: boolean;
    includeParent?: boolean;
    includeChildren?: boolean;
    includeTags?: boolean;
  },
): SerializedTask => ({
  id: task.id,
  uuid: task.uuid,
  title: task.title,
  status: task.status,
  kind: task.kind,
  deadline: task.deadline.toISOString().slice(0, 10),
  startingAt: task.startingAt?.toISOString().slice(0, 10) ?? null,
  startedAt: task.startedAt?.toISOString() ?? null,
  finishedAt: task.finishedAt?.toISOString().slice(0, 10) ?? task.finishedAt?.toISOString() ?? null,
  archivedAt: task.archivedAt?.toISOString() ?? null,
  parentId: task.parentId ?? null,
  userId: task.userId,
  projectId: task.projectId,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
  project:
    options?.includeProject && task.project ? serializeProjectBase(task.project) : undefined,
  parent:
    options?.includeParent && task.parent
      ? serializeTask(task.parent, {
          includeProject: false,
          includeParent: false,
          includeChildren: false,
          includeTags: false,
        })
      : undefined,
  children:
    options?.includeChildren && task.children
      ? task.children.map((child): SerializedTask =>
          serializeTask(child, {
            includeProject: false,
            includeParent: false,
            includeChildren: false,
            includeTags: false,
          }),
        )
      : undefined,
  tags:
    options?.includeTags && task.tagTasks
      ? task.tagTasks.map((tagTask) => serializeTag(tagTask.tag))
      : undefined,
});
