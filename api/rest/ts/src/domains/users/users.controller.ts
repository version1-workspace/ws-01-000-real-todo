import { Controller, Get, Req } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get('me')
  async show(@Req() request: Request): Promise<Record<string, any>> {
    const user = request['user'];

    return { data: user.serialize };
  }
}
