import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Add this import
import { TelegramService } from './telegram.service';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/user.model'; // Adjust the path

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ], // Add this MongooseModule.forFeature
  providers: [TelegramService, UserService],
})
export class TelegramModule {}
