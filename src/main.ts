// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = [
    'https://aneesweatherbot.onrender.com/',
    'http://localhost:3000',
  ];

  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: function (origin, callback) {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Not allowed');
        callback(new Error('Not allowed by CORS'), false);
      }
    },
  });
  // app.enableCors({
  //   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  //   origin: function (origin, callback) {
  //     if (!origin) {
  //       callback(null, true);
  //       return;
  //     }
  //     if (whitelist.includes(origin)) {
  //       callback(null, true);
  //     } else {
  //       console.log('not allowed');
  //       callback(new ImATeapotException('not allowed'), false);
  //     }
  //   },
  // });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
