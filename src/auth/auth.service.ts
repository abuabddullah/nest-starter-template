// import { Injectable } from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';

// @Injectable()
// export class AuthService {
//   create(createAuthDto: CreateAuthDto) {
//     return 'This action adds a new auth';
//   }

//   findAll() {
//     return `This action returns all auth`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} auth`;
//   }

//   update(id: number, updateAuthDto: UpdateAuthDto) {
//     return `This action updates a #${id} auth`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} auth`;
//   }
// }

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { User, UserModel } from '../user/user.schema';
import { JwtPayload } from 'jsonwebtoken';
import { UtilsService } from 'src/utils/utils.service';
import type { UserModel } from '../user/user.schema';
import { User } from '../user/user.schema';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { OtpUserDto } from './dto/otpUser.dto';
import { RefreshUserDto } from './dto/refreshUser.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { AppWebSocketGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: UserModel,

    private readonly utilsService: UtilsService,
    private readonly webSocketGateway: AppWebSocketGateway,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; newUser: any }> {
    const isUserExist = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (isUserExist)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    if (createUserDto.password !== createUserDto.confirm_password)
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);

    const user = await this.userModel.create(createUserDto);

    const otp = this.utilsService.generateOtp(6);

    this.utilsService.sendMail(user.email, otp, 'User created successfully');

    if (!user)
      throw new HttpException('User not created', HttpStatus.BAD_REQUEST);

    user.otp = otp;

    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    const userFromDB = {
      name: user.name,
      email: user.email,
    };

    return {
      message:
        'User created successfully & check your email for otp and verify your account',
      newUser: userFromDB,
    };
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const user = await this.userModel
      .findOne({ email: loginUserDto.email })
      .select('+password');

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isMatch = await this.userModel.comparePassword(
      loginUserDto.password,
      user.password,
    );

    if (!isMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    const accessToken = this.utilsService.createAccessToken({
      id: user._id.toString(),
      role: user.role,
    });

    const refreshToken = this.utilsService.createRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });

    user.refreshToken = refreshToken;

    await user.save();

    const userFromDB = {
      name: user.name,
      email: user.email,
    };

    // Send WebSocket notification
    this.webSocketGateway.server.emit(`notification::${user._id}`, {
      event: 'login_success',
      userId: user._id,
      timestamp: new Date(),
      message: 'You have successfully logged in',
    });
    return { user: userFromDB, accessToken, refreshToken };
  }

  async refresh(
    refreshUserDto: RefreshUserDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userModel.findOne({
      refreshToken: refreshUserDto.refreshToken,
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isVerified = await this.utilsService.verifyJwtToken(
      refreshUserDto.refreshToken,
    );

    if (!isVerified) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const decodedToken = await this.utilsService.verifyJwtToken(
      refreshUserDto.refreshToken,
    );

    if (decodedToken.exp * 1000 < Date.now()) {
      throw new HttpException(
        'Refresh token has expired',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const accessToken = this.utilsService.createAccessToken({
      id: user._id.toString(),
      role: user.role,
    });

    return { accessToken };
  }

  async otp(otpUserDto: OtpUserDto): Promise<{ message: string; value: null }> {
    const user = await this.userModel.findOne({ email: otpUserDto.email });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const otp = this.utilsService.generateOtp(6);

    user.otp = otp;

    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    this.utilsService.sendMail(
      user.email,
      otp,
      'Here is your OTP for verification:',
    );

    return { message: 'Otp sent successfully', value: null };
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<{ message: string; forget_password_token?: string }> {
    const user = await this.userModel.findOne({ email: verifyOtpDto.email });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (user.otp !== verifyOtpDto.otp)
      throw new HttpException('Invalid otp', HttpStatus.BAD_REQUEST);

    if (user.otpExpiry && user.otpExpiry < new Date())
      throw new HttpException('Otp expired', HttpStatus.BAD_REQUEST);

    user.otp = undefined;

    user.otpExpiry = undefined;

    if (!user.isVerified) {
      user.isVerified = true;

      await user.save();

      return { message: 'User verified successfully' };
    }

    const value = this.utilsService.generateOtp(6).toString();

    user.resetPasswordToken = value;

    user.resetPasswordTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    const hash_value = this.utilsService.ganarateHash(value);

    return {
      message: 'Otp verified successfully',
      forget_password_token: hash_value,
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findOne({
      email: forgotPasswordDto.email,
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (!user.resetPasswordToken)
      throw new HttpException(
        'Your forgot password token is not ganarated yet',
        HttpStatus.BAD_REQUEST,
      );

    const isTokenValide = this.utilsService.compareHash(
      user.resetPasswordToken,
      forgotPasswordDto.token,
    );

    if (!isTokenValide)
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);

    if (
      user.resetPasswordTokenExpiry &&
      user.resetPasswordTokenExpiry < new Date()
    )
      throw new HttpException(
        'Refresh Password Token expired',
        HttpStatus.BAD_REQUEST,
      );

    if (forgotPasswordDto.password !== forgotPasswordDto.confirm_password)
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);

    user.password = forgotPasswordDto.password;

    user.resetPasswordToken = undefined;

    user.resetPasswordTokenExpiry = undefined;

    await user.save();

    return { message: 'Password changed successfully' };
  }

  async changePassword(
    user: JwtPayload,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    if (changePasswordDto.password !== changePasswordDto.confirm_password)
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);

    const userFromDB = await this.userModel
      .findById(user.id)
      .select('+password');

    if (!userFromDB)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isOldPasswordValid = await this.userModel.comparePassword(
      changePasswordDto.old_password,
      userFromDB.password,
    );

    if (!isOldPasswordValid)
      throw new HttpException('Invalid old password', HttpStatus.BAD_REQUEST);

    userFromDB.password = changePasswordDto.password;

    await userFromDB.save();

    return { message: 'Password changed successfully' };
  }
}
