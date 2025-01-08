import { IsEmail, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsString()
    contactNumber: string;
}