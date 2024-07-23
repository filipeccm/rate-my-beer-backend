import { NestFactory } from '@nestjs/core';
import { AppModule } from './v1/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/v1');

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
