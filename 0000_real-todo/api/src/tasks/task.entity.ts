import { Entity, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { Base } from '../entities/base.entity';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { IsNotEmpty, IsDate, IsIn, IsNumber } from 'class-validator';
import { Tag } from '../tags/tag.entity';

@Entity('tasks')
export class Task extends Base {
  @Column()
  @IsNotEmpty()
  title: string;

  @Column({ default: 'initial' })
  @IsIn(['initial', 'scheduled', 'completed', 'archived'])
  status: 'initital' | 'scheduled' | 'completed' | 'archived';

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
  tag: Tag;
}
