import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';

@Controller('health-check')
export class HealthCheckController {
  constructor(private healthCheckService: HealthCheckService) {}
  @Get()
  checkHealth() {
    return this.healthCheckService.checkHealth();
  }
}
