import { NestFactory } from '@nestjs/core';
import { AppModule } from './v1/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from '@fastify/helmet';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compression from '@fastify/compress';
import { constants } from 'zlib';

async function bootstrap() {
  const originWhitelist = process.env.CORS_WHITELIST.split(' ');
  const CORS_OPTIONS = {
    origin: originWhitelist,
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Content-Type',
      'Authorization',
    ],
    exposedHeaders: 'Authorization',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
  };

  const adapter = new FastifyAdapter({ bodyLimit: 10 * 1024 * 1024 });
  adapter.enableCors(CORS_OPTIONS);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  app.setGlobalPrefix('/v1');

  await app.register(helmet as any);
  await app.register(compression as any, {
    brotliOptions: { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } },
  });

  const config = new DocumentBuilder()
    .setTitle('Rate My Beer API')
    .setDescription('A REST API for Rate My Beer')
    .setVersion('1.0')
    .addTag('beers')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
