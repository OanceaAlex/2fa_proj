import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() loginUserDto: LoginUserDto) {
    return req.user;
  }
}
