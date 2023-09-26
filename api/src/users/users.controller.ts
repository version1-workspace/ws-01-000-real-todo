import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

type JSONEntity = { [key: string]: any };

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  // @Get('users')
  // async index(): Promise<JSONEntity[]> {
  //   const users = await this.userService.findAll();
  //
  //   return users.map((it) => it.serialize());
  // }

  @Get()
  async show(): Promise<JSONEntity> {
    const user = await this.userService.findOne(1);

    return user.serialize();
  }
}
