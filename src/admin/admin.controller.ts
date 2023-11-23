import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from './admin.service';

@Controller('/api')
export class AdminController {
  constructor(private readonly AdminService: AdminService) {}

  @Post('login')
  async adminLogin(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const adminToken = await this.AdminService.loginAdmin(
        body.email,
        body.password,
      );

      if (adminToken) {
        // Login successful
        return res.status(200).json(adminToken);
      } else {
        // Login failed
        return res.status(401).json({ message: 'Admin login failed' });
      }
    } catch (error) {
      console.error('Error during admin login:', (error as Error).message);
      return res.json({ message: 'Internal server error' });
    }
  }
}

// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Param,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { UserService } from '../user/user.service';

// @Controller('/api/admin')
// export class AdminController {
//   constructor(private readonly userService: UserService) {}

//   @Get('/users')
//   async userList() {
//     try {
//       const users = await this.userService.findAllUsers();
//       return { users };
//     } catch (error) {
//       console.error(
//         'Error while fetching all users:',
//         (error as Error).message,
//       );
//       return { users: [] };
//     }
//   }

//   @Get('/users/:userId')
//   async user(@Param('userId') userId: string) {
//     try {
//       const users = await this.userService.findUserById(userId);
//       return { users };
//     } catch (error) {
//       console.error(
//         'Error while fetching all users:',
//         (error as Error).message,
//       );
//       return { users: [] };
//     }
//   }

//   @Put('/users/:userId/toggleBlock')
//   async toggleBlock(@Param('userId') userId: string) {
//     try {
//       const updatedUser = await this.userService.toggleBlocking(userId);
//       if (updatedUser) {
//         return {
//           success: true,
//           message: 'User blocking toggled successfully',
//           updatedUser,
//         };
//       } else {
//         return { success: false, message: 'User not found' };
//       }
//     } catch (error) {
//       console.error('Error while toggling blocking for user:');
//       throw new InternalServerErrorException('Error toggling user blocking');
//     }
//   }
// }
