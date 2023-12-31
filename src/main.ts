// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ImATeapotException } from '@nestjs/common/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = 'https://aneesweatherbot.onrender.com/';

  app.enableCors({
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
    origin: function (origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        console.log('not alowwed');
        callback(new ImATeapotException('not allowed'), false);
      }
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
