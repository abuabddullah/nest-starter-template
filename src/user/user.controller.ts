// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Controller('user')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Post()
//   create(@Body() createUserDto: CreateUserDto) {
//     return this.userService.create(createUserDto);
//   }

//   @Get()
//   findAll() {
//     return this.userService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.userService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
//     return this.userService.update(+id, updateUserDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.userService.remove(+id);
//   }
// }

import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtThrottlerGuard } from 'src/shared/guards/jwt.throttler.guard';
import { RoleEnum } from 'src/shared/enum/user.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Get('/')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard, JwtThrottlerGuard)
  profile(@Req() req: any) {
    return req.user;
  }

  @Version('1')
  @Post('/')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard, JwtThrottlerGuard)
  admin(@Body() body: any) {
    return body;
  }

  @Version('1')
  @Put('/')
  update() {
    return 'update';
  }

  @Version('1')
  @Patch('/')
  change() {
    return 'change';
  }

  @Version('1')
  @Delete('/')
  delete() {
    return 'delete';
  }
}
