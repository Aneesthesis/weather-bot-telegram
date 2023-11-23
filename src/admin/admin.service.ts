import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.model';
import { generateAuthToken } from '../helper';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
  ) {}

  // async signupAdmin(email: string, password: string): Promise<Admin> {
  //   const admin = new this.adminModel({ email, password });
  //   return await admin.save();
  // }

  async loginAdmin(
    email: string,
    password: string,
  ): Promise<{ token?: string } | null> {
    try {
      const admin = await this.adminModel.findOne({ email }).exec();

      if (!admin) {
        throw new Error('Admin email/password invalid');
      }

      if (password !== admin.password) {
        throw new Error('Admin email/password invalid');
      } else {
        // Generate and return an authentication token
        const token = generateAuthToken(admin);
        return { token };
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      return null;
    }
  }
}
