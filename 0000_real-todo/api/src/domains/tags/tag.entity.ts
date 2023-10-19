import { Entity, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { Base } from '../../entities/base.entity';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
import { TagTask } from '../relations/tagTask.entity';
import { IsNotEmpty, IsIn, IsNumber } from 'class-validator';

@Entity('tags')
export class Tag extends Base {
  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ default: 'enabled' })
  @IsIn(['enabled', 'disabled'])
  status: 'enabled' | 'disabled';

  @Column()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => TagTask)
  project: TagTask;

  @OneToMany(() => TagTask, (tagTask) => tagTask.task)
  tagTask: TagTask;

  @ManyToMany(() => Task)
  tasks: Task[];
}
