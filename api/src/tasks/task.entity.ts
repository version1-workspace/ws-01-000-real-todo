import { Entity, Column } from 'typeorm';
import { Base } from '../entities/base.entity';
import { IsNotEmpty, IsDate, IsIn, IsNumber } from 'class-validator';

@Entity('tasks')
export class Project extends Base {
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
}
