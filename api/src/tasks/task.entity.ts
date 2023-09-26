import { Entity, Column } from 'typeorm';
import { Base } from '../entities/base.entity';

@Entity('projects')
export class Project extends Base {
  @Column()
  title: string;

  @Column({ default: 'initial' })
  status: 'initital' | 'scheduled' | 'completed' | 'archived';

  @Column()
  deadline: Date;

  @Column()
  finishedAt?: Date;

  @Column()
  archivedAt?: Date;

  @Column()
  startingAt?: Date;

  @Column()
  startedAt?: Date;

  @Column()
  parentId?: number;
}
