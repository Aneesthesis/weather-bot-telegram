import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [TelegramModule, AdminModule, DatabaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply((req: Request, res: Response, next: NextFunction) => {
//         // Your CORS configuration here
//         res.header('Access-Control-Allow-Origin', '*');
//         res.header(
//           'Access-Control-Allow-Methods',
//           'GET,HEAD,PUT,PATCH,POST,DELETE',
//         );
//         res.header(
//           'Access-Control-Allow-Headers',
//           'Origin, X-Requested-With, Content-Type, Accept',
//         );
//         next();
//       })
//       .forRoutes({
//         path: '*',
//         method: RequestMethod.ALL,
//       });
//   }
// }
