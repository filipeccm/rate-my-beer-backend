import { NestFactory } from '@nestjs/core';
import { AppModule } from './v1/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/v1');
  app.use(json({ limit: '10mb' }));
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Rate My Beer API')
    .setDescription('A REST API for Rate My Beer')
    .setVersion('1.0')
    .addTag('beers')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
bootstrap();
