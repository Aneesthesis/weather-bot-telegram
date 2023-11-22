import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
  ) {}

  async signupAdmin(email: string, password: string): Promise<Admin> {
    const admin = new this.adminModel({ email, password });
    return await admin.save();
  }

  async loginAdmin(
    email: string,
    password: string,
  ): Promise<{ msg: string } | null> {
    try {
      const admin = await this.adminModel.findOne({ email }).exec();

      if (!admin) {
        throw new Error('Admin email/password invalid');
      }
      if (password !== admin.password) {
        throw new Error('Admin email/password invalid');
      } else {
        return { msg: 'admin login successful' };
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      return null;
    }
  }
}
//   async toggleBlocking(userId: string): Promise<User | null> {
//     try {
//       const user = await this.adminModel.findOne({ userId }).exec();

//       if (!user) {
//         return null;
//       }

//       user.isBlocked = !user.isBlocked;
//       const updatedUser = await user.save();
//       return updatedUser;
//     } catch (error) {
//       console.error(
//         `Error while toggling blocking for user ${userId}:`,
//         (error as Error).message,
//       );
//       throw error;
//     }
//   }

//   async findAllUsers(): Promise<User[]> {
//     try {
//       const users = await this.userModel.find().exec();
//       return users;
//     } catch (error) {
//       console.error('Error while finding all users:', (error as Error).message);
//       throw error;
//     }
//   }
// }
