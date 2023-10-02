import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './config/config';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { Logger } from '@nestjs/common';
import { middleware as expressCtx } from 'express-ctx';
import { setupSwagger } from 'libs/swagger/setup';

const CONFIG = AppConfig();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: CONFIG.CORS,
    },
  );

  // enable DI for class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(expressCtx);

  if (CONFIG.SWAGGER_ENABLED) {
    await setupSwagger(app);
  }

  await app.listen(CONFIG.PORT, CONFIG.HOST);

  Logger.log(`Server running on ${await app.getUrl()}`);
}

bootstrap();
