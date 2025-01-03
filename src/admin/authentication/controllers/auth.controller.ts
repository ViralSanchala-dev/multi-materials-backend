import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { SignupDto } from "../dtos/signup.dto";
import { LoginDto } from "../dtos/login.dto";
import { RefreshTokensDto } from "../dtos/refresh-tokens.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import { ForgotPasswordDto } from "../dtos/forgot-password.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

@Controller("api/auth")
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post("signup")
    async signUp(@Body() signupData: SignupDto) {
        return await this.authService.signUp(signupData);
    }

    @Get('get-user-details')
    @UseGuards(AuthGuard)
    async getUserDetails(@Req() req) {
        return await this.authService.getUserDetails(req.userId);
    }

    @Put('update-user-details')
    @UseGuards(AuthGuard)
    async updateUserDetails(@Body() updateUserDto: UpdateUserDto, @Req() req) {
        return await this.authService.updateUserDetails(updateUserDto, req.userId);
    }

    @Post("login")
    async login(@Body() credential: LoginDto) {
        return await this.authService.login(credential);
    }

    @Post("refresh")
    async refreshToken(@Body() refreshTokenDto: RefreshTokensDto) {
        return await this.authService.refreshTokens(refreshTokenDto?.refreshToken);
    }

    @Put('change-password')
    @UseGuards(AuthGuard)
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req) {
        return await this.authService.changePassword(req.userId, changePasswordDto)
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return await this.authService.forgotPassword(forgotPasswordDto)
    }

    @Get("logout")
    @UseGuards(AuthGuard)
    async logout(@Req() req) {
        return this.authService.logout(req.userId);
    }

    @Get("validate-token")
    @UseGuards(AuthGuard)
    async validateToken() {
        return {
            "status": "success",
            "message": "Token is valid"
        }
    }
}