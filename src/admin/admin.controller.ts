import { Controller, Post, Get, Headers, Body, Res, Put } from '@nestjs/common';
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
  @Get('/bot-token')
  async apiKey(@Headers() headers: Record<string, string>) {
    try {
      const authorizationToken = JSON.stringify(headers.authorization);

      const key = await this.AdminService.getAPIKey(authorizationToken);
      return { key };
    } catch (error) {
      console.error('Error while fetching api key:', (error as Error).message);

      if ((error as Error).message === 'Unauthorized') {
        return {
          status: 403,
          message:
            'Token invalid or might have expired. Log out and come back!',
        };
      }
      return { error, status: 400 };
    }
  }

  @Put('/bot-token')
  async updateAPIKey(
    @Headers() headers: Record<string, string>,
    @Body() body: { new_api_key: string },
  ) {
    try {
      const authorizationToken = JSON.stringify(headers.authorization);
      const updatedAPIKey = await this.AdminService.updateAPIKey(
        body.new_api_key,
        authorizationToken,
      );
      return { updatedAPIKey };
    } catch (error) {
      console.error('Error while updating API key:', (error as Error).message);

      if ((error as Error).message === 'Unauthorized') {
        return {
          status: 403,
          message:
            'Token invalid or might have expired. Log out and come back!',
        };
      }

      return { error, status: 400 };
    }
  }
}
