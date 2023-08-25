import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import appConfig from 'src/config/app.config';
import { jwtConfig } from 'src/config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwt2faStrategy } from './strategies/jwt-2fa.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig)
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy, jwt2faStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
