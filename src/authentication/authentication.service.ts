import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity/user.entity';
import { authenticator } from 'otplib';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const foundUser = await this.usersService.findOneByName(username);
        if (!foundUser)
            return null;
        if (await bcrypt.compare(pass, foundUser.password) === false)
            return null;
        const { password, ...result } = foundUser;
        return result;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        //console.log(process.env.JWT_SECRET);
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async generateTwoFactorAuthSecret(user: User) {
        const secret = authenticator.generateSecret();
        const otpAuthUrl = authenticator.keyuri(user.email, 'AUTH_APPLICATION', secret);

        await this.usersService.setTwoFactorAuthSecret(secret, user.id);

        return {
            secret,
            otpAuthUrl,
        }
    }
}
