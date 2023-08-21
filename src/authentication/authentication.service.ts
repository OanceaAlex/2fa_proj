import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly usersService: UsersService
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const foundUser = await this.usersService.findOneByName(username);
        if (!foundUser)
            return null;
        if (foundUser.password !== pass)
            return null;
        const { password, ...result } = foundUser;
        return result;
    }
}
