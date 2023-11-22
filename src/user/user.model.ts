import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true, default: new Date().toLocaleDateString('en-US') })
  dateCreated!: string;

  @Prop({ required: true, default: false })
  isBlocked!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
