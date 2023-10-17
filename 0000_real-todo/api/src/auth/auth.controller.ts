import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { LoggerService } from '../logger/logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private loggerService: LoggerService,
    private jwtService: JwtService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() body: Record<string, any>) {
    return this.authService.signIn(body.email, body.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(
    @Req() request: Request,
    @Body() body: Record<string, any>,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Record<string, any>> {
    const token = this.extractTokenFromHeader(request);
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('AUTH_SECRET'),
        ignoreExpiration: true,
      });

      const { uuid, refreshToken } = body;
      const result = await this.authService.verifyRefreshToken(payload, {
        uuid,
        refreshToken,
      });
      if (!result) {
        response.status(401);
        return { message: 'invalid refresh token' };
      }

      return result;
    } catch (e) {
      response.status(401);
      this.loggerService.logger.info(e);
      return { message: e.message };
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
