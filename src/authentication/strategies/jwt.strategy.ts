import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-jwt";
import appConfig from "../../config/app.config";
import { jwtConfig } from "src/config/jwt.config";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: appConfig().jwt.secret,
        });
    }
 
    async validate(payload: any) {
        const user = await this.usersService.findOne(payload.sub);
        const { password, ...result } = user;

        return result;
    }
}