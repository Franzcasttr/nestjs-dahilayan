import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

  app.enableCors({
    origin: 'http://localhost/3000',
    credentials: true,
  });

  // app.use('/webhook', express.raw({ type: '*/*' }));
  await app.listen(8000);
}
bootstrap();
