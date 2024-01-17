import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { LoggerService } from '../../lib/modules/logger/logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private loggerService: LoggerService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() body: Record<string, any>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password, rememberMe } = body;
    const json = await this.authService.signIn(email, password);

    if (rememberMe) {
      res.cookie('refershToken', json.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
      });
    }

    return json;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(
    @Req() request: Request,
    @Body() body: Record<string, any>,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Record<string, any>> {
    const refreshToken = this.extractTokenFromCookie(request);
    try {
      const { uuid } = body;
      const result = await this.authService.verifyRefreshToken(uuid, {
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

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies.refreshToken;
  }
}
