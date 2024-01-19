import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Base } from '../../entities/base.entity';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { IsNotEmpty, IsDate, IsIn, IsNumber } from 'class-validator';
import { Tag } from '../tags/tag.entity';

export const TaskStatus = {
  initial: 'initial',
  scheduled: 'scheduled',
  completed: 'completed',
  archived: 'archived',
};

export type TaskStatuses = keyof typeof TaskStatus;

export const TaskKind = {
  task: 'task',
  milestone: 'milestone',
};

export type TaskKinds = keyof typeof TaskKind;

@Entity('tasks')
export class Task extends Base {
  @Column()
  @IsNotEmpty()
  title: string;

  @Column({ default: 'initial' })
  @IsIn(Object.keys(TaskStatus))
  status: TaskStatuses;

  @Column({ default: 'task' })
  @IsIn(Object.keys(TaskKind))
  kind: TaskKinds;

  @Column()
  @IsDate()
  @IsNotEmpty()
  deadline: Date;

  @Column()
  @IsDate()
  finishedAt?: Date;

  @Column()
  @IsDate()
  archivedAt?: Date;

  @Column()
  @IsDate()
  startingAt?: Date;

  @Column()
  @IsDate()
  startedAt?: Date;

  @Column()
  @IsNumber()
  parentId?: number;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @ManyToOne(() => Project)
  project: Project;

  @OneToMany(() => Task, (parent) => parent.children)
  parent: Task;

  @OneToMany(() => Task, (task) => task.parent)
  children: Task[];

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'tagTasks',
    joinColumn: {
      name: 'taskId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];
}
