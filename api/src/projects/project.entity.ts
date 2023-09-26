import { Base } from '../entities/base.entity';

@Entity('projects')
export class Project extends Base {
  @Column({ unique: true })
  slug: string;

  @Column({ default: 'active' })
  status: 'active' | 'deactive';
}
