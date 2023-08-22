import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

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
}
