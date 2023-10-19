import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './domains/auth/auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  index(): { version: string } {
    const res = this.appService.index();
    console.log(res)
    return res
  }
}
