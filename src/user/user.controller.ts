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

      if ((error as Error).message === 'Unauthorized') {
        return {
          status: 403,
          message:
            'Token invalid or might have expired. Log out and come back!',
        };
      }
      return { status: 403, error };
    }
  }

  @Get('/users/:userId')
  async user(@Param('userId') userId: string) {
    try {
      const user = await this.userService.findUserById(userId);
      return { user };
    } catch (error) {
      console.error('Error while fetching user:', (error as Error).message);
      return { error };
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
