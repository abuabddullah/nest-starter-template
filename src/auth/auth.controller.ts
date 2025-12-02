// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post()
//   create(@Body() createAuthDto: CreateAuthDto) {
//     return this.authService.create(createAuthDto);
//   }

//   @Get()
//   findAll() {
//     return this.authService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.authService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
//     return this.authService.update(+id, updateAuthDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.authService.remove(+id);
//   }
// }

import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { OtpUserDto } from './dto/otpUser.dto';
import { RefreshUserDto } from './dto/refreshUser.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';

import { IpThrottlerGuard } from 'src/shared/guards/ip.throttler.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RoleEnum } from 'src/shared/enum/user.enum';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtThrottlerGuard } from 'src/shared/guards/jwt.throttler.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@UseGuards(IpThrottlerGuard)
@Throttle({ default: { limit: 5, ttl: 60000 } })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @Version('1')
  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  @Version('1')
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshUserDto) {
    return this.authService.refresh(refreshDto);
  }

  @Version('1')
  @Post('otp')
  async otp(@Body() otpDto: OtpUserDto) {
    return this.authService.otp(otpDto);
  }

  @Version('1')
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Version('1')
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Version('1')
  @Post('change-password')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard, JwtThrottlerGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
  ) {
    const user = req.user;

    return this.authService.changePassword(user, changePasswordDto);
  }
}
