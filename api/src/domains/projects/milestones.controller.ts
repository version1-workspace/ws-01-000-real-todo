import { Controller, Get, HttpStatus, Param, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { TasksService } from '../tasks/tasks.service';
import { User as DUser } from '../users/user.decorator';
import { User } from '../users/user.entity';

@Controller('projects/:slug/milestones')
export class MilestonesController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('')
  async index(
    @DUser() user: User,
    @Param('slug') slug: string,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.milestones({
      userId: user.id,
      projectSlugs: [slug],
    });

    const orphans = await this.tasksService.orphans({
      userId: user.id,
      slug,
    });

    return {
      data: {
        milestones: result,
        orphans,
      },
    };
  }

  @Put(':id/archive')
  async archive(
    @DUser() user: User,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Record<string, any>> {
    const result = await this.tasksService.find({
      id,
      userId: user.id,
    });

    if (!result) {
      res.json(HttpStatus.NOT_FOUND);
      return;
    }

    await this.tasksService.archive(user.id, [result.uuid]);

    return {
      data: result,
    };
  }
}
