import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Add this import
import { TelegramService } from './telegram.service';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/user.model'; // Adjust the path
import { AdminService } from '../admin/admin.service';
import { Admin, AdminSchema } from '../admin/admin.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ], // Add this MongooseModule.forFeature
  providers: [TelegramService, UserService, AdminService],
})
export class TelegramModule {}
