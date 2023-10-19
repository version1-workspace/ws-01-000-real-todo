import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Exclude } from 'class-transformer';

@Entity()
export class Base {
  @BeforeInsert()
  setDefaultValue() {
    if (!this.uuid) {
      this.uuid = uuid();
    }
  }

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
