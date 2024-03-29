import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { hash } from '../../lib/utils';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  get manager() {
    return this.dataSource.manager;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findByUUID(uuid: string): Promise<User | null> {
    if (!uuid) {
      return null;
    }
    return this.usersRepository.findOneBy({ uuid });
  }

  findByUsername(username: string): Promise<User | null> {
    if (!username) {
      return null;
    }
    return this.usersRepository.findOneBy({ username });
  }

  findByEmail(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }

    return this.usersRepository.findOneBy({ email });
  }

  async signup(username: string, email: string, password: string) {
    const createdAt = new Date();
    const user = this.usersRepository.create({
      username,
      email,
      status: 'active',
      createdAt,
      updatedAt: createdAt,
    });
    user.password = await this.hash(user, password);
    user.refreshToken = await this.hashRefreshToken();
    await this.manager.save(user);
  }

  async updateRefreshToken(user: User) {
    user.refreshToken = await this.hashRefreshToken();
    await this.manager.save(user);

    return user;
  }

  async hash(user: User, password: string) {
    const res = await hash(password, this.sugar, this.stretchCount(user));

    return res;
  }

  async hashRefreshToken() {
    const base = crypto.randomBytes(64).toString('base64');
    const res = await hash(base, this.sugar, 3);

    return res;
  }

  async signin(user: User, password: string) {
    const base = [password, this.sugar].join('_');
    return bcrypt.compare(base, user.password);
  }

  stretchCount(user: User): number {
    return Math.floor(user.createdAt.getSeconds()) % 5;
  }

  async remove(id: number): Promise<void> {
    await this.manager.delete(User, id);
  }

  get sugar() {
    return this.configService.get('AUTH_SUGAR');
  }
}
