import { Entity, Column } from 'typeorm';
import { Base } from '../entities/base.entity';

@Entity('projects')
export class Project extends Base {
  @Column()
  name: string;

  @Column({ default: 'initial' })
  status: 'initital' | 'active' | 'archived';

  @Column()
  deadline: Date;

  @Column()
  startingAt?: Date;

  @Column()
  startedAt?: Date;

  @Column()
  archivedAt?: Date;

  @Column()
  finishedAt?: Date;

  @Column()
  goal: string;

  @Column()
  shouldbe: string;
}
