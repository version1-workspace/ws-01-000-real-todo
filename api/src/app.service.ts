import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  index(): { version: string } {
    return { version: this.configService.get('app.api.version') };
  }
}
