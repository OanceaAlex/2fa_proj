import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import appConfig from "src/config/app.config";
import { UsersService } from "src/users/users.service";

@Injectable()
export class jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: appConfig().jwt.secret,
        });
    }

    async validate(payload: any){
        const user = await this.usersService.findOne(payload.sub)
        const {password, ...userWithoutPass} = user;

        if (!userWithoutPass.isTwoFactorAuthEnabled){
            // return userWithoutPass;
            throw new UnauthorizedException('User must have 2fa Enabled');
        }
        if (payload.isTwoFactorAuthenticated) {
            return userWithoutPass;
        }
    }
}