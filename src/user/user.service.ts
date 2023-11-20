import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(username: string, userId: string): Promise<User> {
    const user = new this.userModel({ username, userId });
    return await user.save();
  }

  async findUserById(userId: string): Promise<User | null> {
    return await this.userModel.findOne({ userId }).exec();
  }

  async toggleBlocking(userId: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ userId }).exec();

      if (!user) {
        return null;
      }

      user.isBlocked = !user.isBlocked;
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      console.error(
        `Error while toggling blocking for user ${userId}:`,
        (error as Error).message,
      );
      throw error;
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find().exec();
      return users;
    } catch (error) {
      console.error('Error while finding all users:', (error as Error).message);
      throw error;
    }
  }
}
