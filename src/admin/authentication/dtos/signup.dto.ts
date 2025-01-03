import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class SignupDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsString()
    @MinLength(8)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        }
    )
    password: string;

    @IsString()
    contactNumber: string;
}