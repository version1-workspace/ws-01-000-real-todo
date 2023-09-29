import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Base } from '../entities/base.entity';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
import { IsNotEmpty, IsDate, IsIn, IsNumber } from 'class-validator';

@Entity('projects')
export class Project extends Base {
  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ default: 'initial' })
  @IsIn(['initial', 'active', 'archived'])
  status: 'initital' | 'active' | 'archived';

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
  goal: string;

  @Column()
  shouldbe?: string;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ManyToOne(() => User)
  user: User

  @OneToMany(() => Task, (task) => task.project)
  @JoinColumn({ name: "projectId", referencedColumnName: "id" })
  tasks: Task[]
}
