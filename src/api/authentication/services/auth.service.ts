import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { SignupDto } from "../dtos/signup.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/api/authentication/schemas/user.schema";
import * as bcrypt from "bcrypt";
import { LoginDto } from "../dtos/login.dto";
import { JwtService } from "@nestjs/jwt";
import { RefreshToken } from "src/api/authentication/schemas/refresh-token.schema";
import { v4 as uuidv4 } from "uuid";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import { ForgotPasswordDto } from "../dtos/forgot-password.dto";
import { Otp } from "src/api/authentication/schemas/otp.schema";
import { UpdateUserDto } from "../dtos/update-user.dto";

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private UserModal: Model<User>,
        @InjectModel(RefreshToken.name) private RefreshTokenModal: Model<RefreshToken>,
        @InjectModel(Otp.name) private OtpModal: Model<Otp>,
        private jwtService: JwtService
    ) { }

    async signUp(signupData: SignupDto) {
        try {
            const { name, email, username, password, contactNumber } = signupData;

            // First check that the email is not already used
            const emailUsed = await this.UserModal.findOne({ email: email });
            if (emailUsed) {
                throw new BadRequestException("Email already used");
            }


            const usernameUsed = await this.UserModal.findOne({ username: username });

            if (usernameUsed) {
                throw new BadRequestException("Username already used");
            }

            // hash the password
            const hashPassword = await bcrypt.hash(password, 10);

            // create the user
            const createdUser = await this.UserModal.create({
                name,
                email,
                username,
                contactNumber,
                password: hashPassword,
                isAdmin: true
            });
            if (createdUser) {
                return {
                    status: "success",
                    message: "User created successfully"
                };
            }
            return {
                status: "error",
                message: "Error creating user"
            };
        } catch (error) {
            throw new HttpException({
                status: 'error',
                message: error.message,
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async login(loginDto: LoginDto) {
        try {
            const { email, password } = loginDto;

            // Find user by email
            const user = await this.UserModal.findOne({
                $or: [
                    { email: email },
                    { username: email }
                ],
                isAdmin: true
            });

            // If user not found, throw unauthorized exception
            if (!user) {
                throw new UnauthorizedException("Invalid credentials");
            }

            // Check if password is correct
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new UnauthorizedException("Invalid credentials");
            }
            return this.generateJwtToken(user);
        } catch (error) {
            throw new HttpException({
                status: 'error',
                message: error.message,
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async refreshTokens(token: string) {
        try {
            const refreshToken = await this.RefreshTokenModal.findOne({
                token: token,
                expires: { $gt: new Date() }
            });

            if (!refreshToken) {
                throw new UnauthorizedException("Invalid token");
            }

            const user = await this.UserModal.findById(refreshToken.userId);
            return this.generateJwtToken(user);
        } catch (error) {
            throw new HttpException({
                status: 'error',
                message: error.message,
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Generate JWT token and refresh token
    async generateJwtToken(user) {
        try {
            const userId = user._id;
            const accessToken = await this.jwtService.signAsync({ userId });

            const decoded = this.jwtService.decode(accessToken) as { exp: number } | null;

            let expireTime = null;
            if (decoded && decoded.exp) {
                expireTime = decoded.exp * 1000;
            }

            const refreshToken = await uuidv4();
            await this.storeRefreshToken(userId, refreshToken);
            return {
                status: "success",
                user: {
                    id: userId,
                    name: user.name,
                    email: user.email,
                    accessToken,
                    tokenType: "Bearer",
                    expireTime,
                    refreshToken
                },
                message: "Details fetched successfully",
            }
        } catch (error) {
            throw new HttpException({
                status: 'error',
                message: error.message,
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Store refresh token in databaseF
    async storeRefreshToken(userId: string, refreshToken: string) {

        const expiryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

        await this.RefreshTokenModal.updateOne(
            { userId },
            {
                $set: {
                    token: refreshToken,
                    expires: expiryDate
                },
            },
            {
                upsert: true
            }
        )
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        try {

            if (userId != changePasswordDto?.id) {
                throw new UnauthorizedException("Invalid user");
            }

            const user = await this.UserModal.findById(userId);

            if (!user) {
                throw new NotFoundException("User not found");
            }

            const { oldPassword, newPassword } = changePasswordDto;
            const comparePassword = await bcrypt.compare(oldPassword, user.password);

            if (!comparePassword) {
                throw new BadRequestException("Invalid old password");
            }

            const hashPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashPassword;
            const updatedUser = await user.save();
            if (updatedUser) {
                return {
                    status: "success",
                    message: "Password changed successfully"
                }
            } else {
                return {
                    status: "error",
                    message: "Error changing password"
                }
            }
        } catch (error) {
            throw new HttpException({
                status: 'error',
                message: error.message,
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async forgotPassword(ForgotPasswordDto: ForgotPasswordDto) {
        const { email } = ForgotPasswordDto;
        const user = await this.UserModal.findOne({ email: email, isAdmin: true });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        const randomOtp = Math.floor(100000 + Math.random() * 900000);

        var timeObject = new Date();
        timeObject.setTime(timeObject.getTime() + 1000 * 60);

        await this.OtpModal.create({
            otp: randomOtp,
            userId: user._id,
            attempts: 1,
            expiryDate: timeObject,
            lastAttemtTime: timeObject,
            isBlocked: false
        });
    }

    async logout(userId: string) {
        await this.RefreshTokenModal.deleteMany({ userId });
        return {
            status: "success",
            message: 'Logged out successfully'
        };
    }

    async getUserDetails(userId: string) {
        try {
            const user = await this.UserModal.findById(userId);
            if (!user) {
                throw new NotFoundException("User not found");
            }
            return {
                status: "success",
                message: "User details fetched successfully",
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    username: user.username,
                    contactNumber: user.contactNumber
                }
            }
        } catch (error) {
            throw new HttpException({
                status: 'error',
                message: error.message,
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateUserDetails(updateUserDto: UpdateUserDto, userId: string) {
        try {
            const user = await this.UserModal.findById(userId);
            if (!user) {
                throw new NotFoundException("User not found");
            }
            const emailExistsInOtherUser = await this.UserModal.findOne({
                email: updateUserDto?.email,
                _id: { $ne: userId }
            });

            if (emailExistsInOtherUser) {
                throw new BadRequestException("Email already used");
            }

            const usernameExistsInOtherUser = await this.UserModal.findOne({
                username: updateUserDto?.username,
                _id: { $ne: userId }
            });

            if (usernameExistsInOtherUser) {
                throw new BadRequestException("Username already used");
            }

            const { name, email, username, contactNumber } = updateUserDto;
            user.name = name;
            user.email = email;
            user.username = username;
            user.contactNumber = contactNumber;
            const updatedUser = await user.save();
            if (updatedUser) {
                return {
                    status: "success",
                    message: "User details updated successfully"
                }
            } else {
                return {
                    status: "error",
                    message: "Error updating user details"
                }
            }
        } catch (error) {
            throw new HttpException({
                status: 'error',
                message: error.message,
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}