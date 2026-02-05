import { Controller, Get } from '@nestjs/common';
import { Log } from '../logging-interceptor/logging-interceptor.service';

@Controller('health')
export class HealthController {
  @Get()
  @Log()
  check() {
    return {
      status: 'ok',
      message: 'Backend is up and running',
    };
  }
}
