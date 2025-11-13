import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dataBaseConfig } from './core/database/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingInterceptorModule } from './core/logging-interceptor/logging-interceptor.module';
import { LoggingInterceptor } from './core/logging-interceptor/logging-interceptor.service';
import { HealthModule } from './core/health/health.module';
import { TaskModule } from './feature/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataBaseConfig),
    HealthModule,
    TaskModule,
    LoggingInterceptorModule,
  ],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
