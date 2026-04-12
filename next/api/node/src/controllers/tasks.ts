import type { Response } from 'express';
import { z } from 'zod';
import { serializeTask } from '../lib/serializers.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';
import { tasksService } from '../services/tasks.js';

const taskStatuses = z.enum(['initial', 'scheduled', 'completed', 'archived']);
const taskKinds = z.enum(['task', 'milestone']);
const sortTypes = z.enum(['deadline', 'startedAt', 'updatedAt', 'createdAt']);

const listQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  dateType: sortTypes.optional(),
  sortType: sortTypes.optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  projectId: z.string().uuid().optional(),
  status: z.union([taskStatuses, z.array(taskStatuses)]).optional(),
  'status[]': z.union([taskStatuses, z.array(taskStatuses)]).optional(),
});

const createSchema = z.object({
  title: z.string().min(1),
  projectId: z.string().uuid(),
  deadline: z.string().min(1),
  startingAt: z.string().optional().nullable(),
  status: taskStatuses,
  kind: taskKinds,
});

const updateSchema = z.object({
  title: z.string().optional(),
  projectId: z.string().uuid().optional(),
  status: taskStatuses.optional(),
  deadline: z.string().optional(),
  finishedAt: z.string().optional().nullable(),
  startingAt: z.string().optional().nullable(),
  startedAt: z.string().optional().nullable(),
  archivedAt: z.string().optional().nullable(),
});

const uuidParams = z.object({
  id: z.string().uuid(),
});

const readStatuses = (
  query: z.infer<typeof listQuerySchema>,
): Array<'initial' | 'scheduled' | 'completed' | 'archived'> | undefined => {
  const value = query['status[]'] ?? query.status;
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value : [value];
};

export const tasksController = {
  async list(req: AuthenticatedRequest, res: Response) {
    const query = listQuerySchema.parse(req.query);
    const result = await tasksService.search({
      userId: req.currentUser!.id,
      ...query,
      status: readStatuses(query),
    });

    res.json({
      data: result.data.map((task) =>
        serializeTask(task, {
          includeProject: true,
          includeParent: true,
          includeChildren: true,
          includeTags: true,
        }),
      ),
      pageInfo: result.pageInfo,
    });
  },

  async create(req: AuthenticatedRequest, res: Response) {
    const body = createSchema.parse(req.body);
    const task = await tasksService.create({
      userId: req.currentUser!.id,
      ...body,
    });

    res.status(201).json({
      data: [
        serializeTask(task, {
          includeProject: true,
          includeParent: true,
          includeChildren: true,
          includeTags: true,
        }),
      ],
    });
  },

  async show(req: AuthenticatedRequest, res: Response) {
    const { id } = uuidParams.parse(req.params);
    const task = await tasksService.findOne(req.currentUser!.id, id);
    res.json({
      data: serializeTask(task, {
        includeProject: true,
        includeParent: true,
        includeChildren: true,
        includeTags: true,
      }),
    });
  },

  async update(req: AuthenticatedRequest, res: Response) {
    const { id } = uuidParams.parse(req.params);
    const body = updateSchema.parse(req.body);
    const task = await tasksService.update(req.currentUser!.id, id, body);
    res.json({
      data: serializeTask(task, {
        includeProject: true,
        includeParent: true,
        includeChildren: true,
        includeTags: true,
      }),
    });
  },

  async archive(req: AuthenticatedRequest, res: Response) {
    const { id } = uuidParams.parse(req.params);
    const [task] = await tasksService.archive(req.currentUser!.id, [id]);
    res.json({ data: serializeTask(task) });
  },

  async complete(req: AuthenticatedRequest, res: Response) {
    const { id } = uuidParams.parse(req.params);
    const [task] = await tasksService.complete(req.currentUser!.id, [id]);
    res.json({ data: serializeTask(task) });
  },

  async reopen(req: AuthenticatedRequest, res: Response) {
    const { id } = uuidParams.parse(req.params);
    const [task] = await tasksService.reopen(req.currentUser!.id, [id]);
    res.json({ data: serializeTask(task) });
  },
};
