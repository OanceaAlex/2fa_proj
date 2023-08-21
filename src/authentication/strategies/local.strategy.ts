import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticationService } from "../authentication.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authenticationService: AuthenticationService){
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const validatedUser = await this.authenticationService.validateUser(username, password);
        if (!validatedUser)
            throw new UnauthorizedException();
        return validatedUser;
    }

}