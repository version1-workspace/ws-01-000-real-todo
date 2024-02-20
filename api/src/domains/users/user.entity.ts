import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from '../../entities/base.entity';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';
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

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
