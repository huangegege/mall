import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import * as serverStatic from 'serve-static';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './core/exception/exception.filter';

async function bootstrap() {
  config();

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionFilter());
  app.use('/static', serverStatic(join(__dirname, '..', 'public')));
  await app.listen(3000);
}
bootstrap();
