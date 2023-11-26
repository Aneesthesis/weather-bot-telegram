import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.model';
import { decodeAuthToken, generateAuthToken } from '../helper';

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

  async getAPIKey(authorizationHeader: string): Promise<string | null> {
    try {
      const decodedToken = decodeAuthToken(
        authorizationHeader.split(' ')[1].slice(0, -1),
      );

      if (!decodedToken || !decodedToken.adminId) {
        throw new Error('Unauthorized');
      }

      console.log(decodedToken);

      const admin = await this.adminModel
        .findOne({ _id: decodedToken.adminId })
        .exec();

      if (!admin) {
        throw new Error('Admin not found');
      }

      return admin.api_key;
    } catch (error) {
      console.error('Error while getting API key:', (error as Error).message);
      return null;
    }
  }

  async getAPIKeyBE(): Promise<string | null> {
    try {
      // Assuming you have a model for Admin and the API key is stored in a field called 'api_key'
      const admin = await this.adminModel.findOne().exec();

      if (!admin) {
        throw new Error('Admin not found');
      }

      return admin.api_key;
    } catch (error) {
      console.error('Error while getting API key:', (error as Error).message);
      return null;
    }
  }

  async updateAPIKey(
    updatedKey: string,
    authorizationHeader: string,
  ): Promise<string> {
    try {
      const decodedToken = decodeAuthToken(
        authorizationHeader.split(' ')[1].slice(0, -1),
      );

      if (!decodedToken || !decodedToken.adminId) {
        throw new Error('Unauthorized');
      }

      const admin = await this.adminModel
        .findOne({ _id: decodedToken.adminId })
        .exec();

      console.log(admin);

      if (!admin) {
        throw new Error('Admin not found');
      }

      admin.api_key = updatedKey;

      await admin.save(); // Save the changes to the database

      return admin.api_key;
    } catch (error) {
      console.error(
        'Error while updating bot API key:',
        (error as Error).message,
      );
      throw error; // Rethrow the error for the calling code to catch
    }
  }
}
