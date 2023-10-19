import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from '../../entities/base.entity';
import { Task } from '../tasks/task.entity';
import { Tag } from '../tags/tag.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Entity('tagTasks')
export class TagTask extends Base {
  @Column()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  tagId: number;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  taskId: number;

  @ManyToOne(() => Task)
  task: Task;

  @ManyToOne(() => Tag)
  tag: Tag;
}
