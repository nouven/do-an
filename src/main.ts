import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from './core/pipe/validation.pipe';
import * as multipart from 'fastify-multipart';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({});

  fastifyAdapter.register(multipart, {
    addToBody: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  app.enableCors();
  app.setGlobalPrefix('/api/v1');
  //app.useGlobalPipes(new ValidationPipe()),
  await app.listen(parseInt(process.env.APP_SERVER_PORT), '0.0.0.0');
}
bootstrap();
