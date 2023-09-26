import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column()
  username: string;

  @Column({ default: 'active' })
  status: 'active' | 'deactive';

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  serialize() {
    return new UserSerialiable(this).serialize();
  }
}

class UserSerialiable {
  private readonly user: User;
  constructor(user: User) {
    this.user = user;
  }

  serialize() {
    return {
      uuid: this.user.uuid,
      username: this.user.username,
      status: this.user.status,
      createdAt: this.user.createdAt,
    };
  }
}
