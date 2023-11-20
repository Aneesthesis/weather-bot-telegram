import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.model';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: 'mongodb+srv://crunchysambusa:jmGZjwgBdC4gcBlZ@cluster0.6l6nxek.mongodb.net/Weather_bot_admin?retryWrites=true&w=majority',
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class DatabaseModule {}
