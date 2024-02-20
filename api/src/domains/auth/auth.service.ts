import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { LoggerService } from '../../lib/modules/logger/logger.service';

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

    const res = this.token(user);
    return res;
  }

  async verifyRefreshToken(
    uuid: string,
    body: {
      uuid: string;
      refreshToken: string;
    },
  ) {
    const user = await this.usersService.findByUUID(uuid);
    if (!user) {
      this.loggerService.logger.info(`id: ${uuid}. user is not found.`);
      return undefined;
    }

    if (body.uuid !== user.uuid || user.refreshToken !== body.refreshToken) {
      this.loggerService.logger.info(`id: ${uuid} / refresh token is invalid.`);
      return undefined;
    }

    return this.token(user);
  }

  async token(user: User) {
    await this.usersService.updateRefreshToken(user);

    const payload = {
      sub: user.username,
      refreshToken: user.refreshToken,
    };

    const accessTokens = await this.jwtService.signAsync(payload);

    return {
      uuid: user.uuid,
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: user.refreshToken,
    };
  }

  get sugar() {
    return this.configService.get('AUTH_SUGAR');
  }
}
