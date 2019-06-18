import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { loggerProviders } from './logger.providers';

@Global()
@Module({
  providers: [
    ...loggerProviders,
    LoggerService
  ],
  exports: [
    LoggerService
  ]
})
export class LoggerModule {
}
