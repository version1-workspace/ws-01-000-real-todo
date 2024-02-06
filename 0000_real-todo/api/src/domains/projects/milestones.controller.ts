import { Controller, Get, Param } from '@nestjs/common';
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
}
