import { IsString } from "class-validator";

export class OtpCodeDto {
    @IsString()
    readonly twoFactorAuthCode: string
}