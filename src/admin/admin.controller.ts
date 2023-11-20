// admin.controller.ts
import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  // @Get('login')
  // @Render('login') // Assuming you are using a view engine like ejs or handlebars
  // loginPage() {
  //   return { message: 'Welcome to the Admin Login Page' };
  // }

  // @Post('login')
  // async login(@Req() req, @Res() res) {
  //   const { email, password } = req.body;

  //   // Validate the user's credentials
  //   const user = await this.userService.findByEmail(email);

  //   if (!user || user.password !== password) {
  //     // Redirect back to login page with an error message
  //     return res.redirect('/admin/login?error=InvalidCredentials');
  //   }

  //   // Perform the login (session or token-based, depending on your setup)
  //   // For example, using session-based authentication:
  //   req.session.user = user;

  //   // Redirect to the user list or dashboard
  //   return res.redirect('/admin/users');
  // }

  @Get('users')
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
}
