import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  checkHealth() {
    return {
      status: 'ok',
      message: 'AlumniConnect API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
