import {
  Body,
  Controller,
  Delete,
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
    const data = await this.authService.signIn(email, password);

    if (rememberMe) {
      this.setRefreshToken(res, data.refreshToken);
    }

    return { data };
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
        return { message: 'invalid refresh token or uuid' };
      }

      this.setRefreshToken(response, result.refreshToken);

      return { data: result };
    } catch (e) {
      response.status(401);
      this.loggerService.logger.info(e);
      return { message: e.message };
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Delete('refresh')
  async clearRefreshToken(@Res({ passthrough: true }) response: Response) {
    this.removeRefreshToken(response);
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies.refreshToken;
  }

  private setRefreshToken(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
  }

  private removeRefreshToken(res: Response) {
    res.clearCookie('refreshToken', {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
  }
}
