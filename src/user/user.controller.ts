// admin.controller.ts
import {
  Controller,
  Get,
  Post,
  Headers,
  Put,
  Param,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { log } from 'console';

@Controller('/api/admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users')
  async userList(@Headers() headers: Record<string, string>) {
    try {
      const authorizationToken = JSON.stringify(headers.authorization);

      const users = await this.userService.findAllUsers(authorizationToken);
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
      const user = await this.userService.findUserById(userId);
      return { user };
    } catch (error) {
      console.error('Error while fetching user:', (error as Error).message);
      return { user: [] };
    }
  }

  @Put('/users/:userId/toggleBlock')
  async toggleBlock(
    @Param('userId') userId: string,
    @Headers() headers: Record<string, string>,
  ) {
    try {
      const authorizationToken = JSON.stringify(headers.authorization);
      const updatedUser = await this.userService.toggleBlocking(
        userId,
        authorizationToken,
      );
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
