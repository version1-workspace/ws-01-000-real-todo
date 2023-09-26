import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, default: uuid() })
  uuid: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  json() {
    return JSON.parse(JSON.stringify(this));
  }
}

