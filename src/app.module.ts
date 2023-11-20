import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseModule } from './database/database.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import { DatabaseModule } from './database/database.module';

@Module({
  imports: [TelegramModule, AdminModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
