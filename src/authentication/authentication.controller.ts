import { Controller, Post, UseGuards, Request, Body, Req, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { request } from 'http';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
    ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginUserDto: LoginUserDto) {
    return this.authenticationService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('2fa/turn-on')
  async turnOnTwoFactorAuth(@Req() request, @Body() body){
    const isValid = this.authenticationService.isTwoFactorAuthCodeValid(
      body.twoFactorAuthCode,
      request.user,
    )
    if (!isValid){
      throw new UnauthorizedException("Wrong authentication code.");
    }
    await this.usersService.turnOnTwoFactorAuth(request.user.id);
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('2fa/generate')
  async generateTwoFactorAuthSecret(@Request() request){
    return await this.authenticationService.generateTwoFactorAuthSecret(request.user);
  }

}
