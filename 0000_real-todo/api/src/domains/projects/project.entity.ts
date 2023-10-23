import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Base } from '../../entities/base.entity';
import { Stat } from '../../entities/stat.entity';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
import { IsNotEmpty, IsDate, IsIn, IsNumber } from 'class-validator';

export const Status = {
  initial: 'initial',
  active: 'active',
  archived: 'archived'
}

export type StatusType = keyof typeof Status

@Entity('projects')
export class Project extends Base {
  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ default: 'initial' })
  @IsIn(Object.keys(Status))
  status: StatusType;

  @Column()
  @IsNotEmpty()
  @IsDate()
  deadline: Date;

  @Column()
  @IsDate()
  startingAt?: Date;

  @Column()
  @IsDate()
  startedAt?: Date;

  @Column()
  @IsDate()
  archivedAt?: Date;

  @Column()
  @IsDate()
  finishedAt?: Date;

  @Column()
  @IsNotEmpty()
  slug: string;

  @Column()
  @IsNotEmpty()
  goal: string;

  @Column()
  shouldbe?: string;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  milestones: Task[];

  stats: Stat;
}
