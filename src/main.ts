import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,

    exceptionFactory: (errors) => {
      const messages = errors.flatMap(error => {
        if (error.constraints) {
          return Object.values(error.constraints);
        }
        if (error.children && error.children.length > 0) {
          return error.children.flatMap(childError =>
            Object.values(childError.constraints || {})
          );
        }
        return [];
      });

      return new BadRequestException(messages);
    },

  }));
  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();