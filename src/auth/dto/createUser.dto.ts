import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { OAuthProviderEnum } from 'src/shared/enum/user.enum';

export class CreateUserDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Title must be at least 3 charaters long' })
  @MaxLength(50, { message: 'Title can not be longer than 50 charaters' })
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email' })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(5, { message: 'Content must be at least 3 charaters long' })
  email: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  password: string;

  @IsOptional()
  confirm_password: string;

  @IsString({ message: 'Avatar must be a string' })
  @IsOptional()
  avatar?: string;

  @IsOptional()
  oauthProvider?: OAuthProviderEnum;
}
