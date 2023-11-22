// admin.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';

@Controller('/api/admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users')
  async userList() {
    try {
      const users = await this.userService.findAllUsers();
      return { users };
    } catch (error) {
      console.error(
        'Error while fetching all users:',
        (error as Error).message,
      );
      return { users: [] };
    }
  }

  @Get('/users/:userId')
  async user(@Param('userId') userId: string) {
    try {
      const users = await this.userService.findUserById(userId);
      return { users };
    } catch (error) {
      console.error(
        'Error while fetching all users:',
        (error as Error).message,
      );
      return { users: [] };
    }
  }

  @Put('/users/:userId/toggleBlock')
  async toggleBlock(@Param('userId') userId: string) {
    try {
      const updatedUser = await this.userService.toggleBlocking(userId);
      if (updatedUser) {
        return {
          success: true,
          message: 'User blocking toggled successfully',
          updatedUser,
        };
      } else {
        return { success: false, message: 'User not found' };
      }
    } catch (error) {
      console.error('Error while toggling blocking for user:');
      throw new InternalServerErrorException('Error toggling user blocking');
    }
  }
}
