import { Response } from 'express';
import { z } from 'zod';
import { serializeTask } from '../lib/serializers.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { tasksService } from '../services/tasks.js';

const slugSchema = z.object({
  slug: z.string().min(1),
});

const paramsSchema = z.object({
  slug: z.string().min(1),
  id: z.string().uuid(),
});

export const milestonesController = {
  async list(req: AuthenticatedRequest, res: Response) {
    const { slug } = slugSchema.parse(req.params);
    const data = await tasksService.milestones(req.currentUser!.id, slug);
    res.json({
      data: {
        milestones: data.milestones.map((task) => serializeTask(task)),
        orphans: data.orphans.map((task) => serializeTask(task)),
      },
    });
  },

  async archive(req: AuthenticatedRequest, res: Response) {
    const { id } = paramsSchema.parse(req.params);
    const [task] = await tasksService.archive(req.currentUser!.id, [id]);
    res.json({ data: serializeTask(task) });
  },
};
