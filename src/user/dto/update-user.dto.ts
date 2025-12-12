import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  MinLength,
} from 'class-validator';
import { RoleEnum } from 'src/shared/enum/user.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  // couverture?: Express.Multer.File;
  // video?: Express.Multer.File;
}
