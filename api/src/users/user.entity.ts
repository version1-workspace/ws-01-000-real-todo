import { Entity, Column } from 'typeorm';
import { Base } from '../entities/base.entity';

@Entity('users')
export class User extends Base {
  @Column({ unique: true })
  username: string;

  @Column({ default: 'active' })
  status: 'active' | 'deactive';
}
