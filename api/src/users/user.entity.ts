import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Base } from '../entities/base.entity';
import { IsNotEmpty, IsEmail, IsIn } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends Base {
  @Column({ unique: true })
  @IsNotEmpty()
  username: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  @Exclude()
  password: string;

  @Column()
  @IsNotEmpty()
  @Exclude()
  refreshToken: string;

  @Column({ default: 'active' })
  @IsNotEmpty()
  @IsIn(['active', 'deactive'])
  status: 'active' | 'deactive';
}
