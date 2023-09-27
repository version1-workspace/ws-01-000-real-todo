import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  async show(@Req() request: Request): Promise<Record<string, any>> {
    const user = request['user'];

    return user;
  }
}
