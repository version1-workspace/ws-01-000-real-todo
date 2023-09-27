import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Exclude } from 'class-transformer';

@Entity()
export class Base {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, default: uuid() })
  uuid: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}

