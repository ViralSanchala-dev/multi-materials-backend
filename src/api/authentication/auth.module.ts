import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { RefreshToken, RefreshTokenSchema } from "./schemas/refresh-token.schema";
import { Otp, OtpSchema } from "./schemas/otp.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            },
            {
                name: RefreshToken.name,
                schema: RefreshTokenSchema
            },
            {
                name: Otp.name,
                schema: OtpSchema
            }
        ])],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {

}