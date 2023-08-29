import { Controller, Post, UseGuards, Request, Body, Req, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { request } from 'http';
import { OtpCodeDto } from 'src/users/dtos/otp-code.dto';
import { Jwt2faAuthGuard } from 'src/common/guards/jwt-2fa-auth.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
    ) {}


  // login simple. returns basic jwt token
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginUserDto: LoginUserDto) {
    return this.authenticationService.login(req.user);
  }

  // turns on 2fa for user
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @Post('2fa/turn-on')
  async turnOnTwoFactorAuth(@Req() request, @Body() body: OtpCodeDto){
    const isValid = this.authenticationService.isTwoFactorAuthCodeValid(
      body.twoFactorAuthCode,
      request.user,
    )
    if (!isValid){
      throw new UnauthorizedException("Wrong authentication code.");
    }
    await this.usersService.turnOnTwoFactorAuth(request.user.id);
  }

  // turns off 2fa for user
  @UseGuards(Jwt2faAuthGuard)
  @ApiBearerAuth()
  @Post('2fa/turn-off')
  @HttpCode(200)
  async turnOffTwoFactorAuth(@Req() request) {
    return await this.usersService.turnOffTwoFactorAuth(request.user.id);
  }
  
  // generates 2fa uri for google otp
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('2fa/generate')
  async generateTwoFactorAuthSecret(@Request() request){
    return await this.authenticationService.generateTwoFactorAuthSecret(request.user);
  }

  // login w/ 2fa. Returns 2fa jwt token
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @Post('2fa/login-2fa')
  async authenticate2fa(@Request() request, @Body() body: OtpCodeDto){
    const isValid = this.authenticationService.isTwoFactorAuthCodeValid(
      body.twoFactorAuthCode,
      request.user,
    );

    if(!isValid) {
      throw new UnauthorizedException('Wrong authentication code.');
    }
    return this.authenticationService.loginWith2fa(request.user)
  }

}
