import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { LoggerService } from '../logger/logger.service';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  sub: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private loggerService: LoggerService,
    private configService: ConfigService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const ok = await this.usersService.signin(user, password);
    if (!ok) {
      throw new UnauthorizedException();
    }

    return this.returnToken(user);
  }

  async verifyRefreshToken(
    payload: JwtPayload,
    body: {
      uuid: string;
      refreshToken: string;
    },
  ) {
    const user = await this.usersService.findByUsername(payload.sub);
    if (!user) {
      this.loggerService.logger.info(
        `username: ${payload.sub} / user is not found.`,
      );
      return undefined;
    }

    if (
      body.uuid !== user.uuid ||
      payload.refreshToken !== body.refreshToken ||
      user.refreshToken !== body.refreshToken
    ) {
      this.loggerService.logger.info(
        `username: ${payload.sub} / refresh token is invalid.`,
      );
      return undefined;
    }

    return this.returnToken(user);
  }

  async returnToken(user: User) {
    await this.usersService.updateRefreshToken(user);

    const payload = {
      sub: user.username,
      refreshToken: user.refreshToken,
    };

    return {
      uuid: user.uuid,
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: user.refreshToken
    };
  }

  get sugar() {
    return this.configService.get('AUTH_SUGAR');
  }
}
