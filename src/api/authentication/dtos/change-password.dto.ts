import { IsString, Matches, MinLength } from "class-validator";

export class ChangePasswordDto {

    @IsString()
    id: string;

    @IsString()
    oldPassword: string;

    @IsString()
    @MinLength(8)
    @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, { message: 'New Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.' })
    newPassword: string;
}