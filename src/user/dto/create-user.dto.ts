import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { OAuthProviderEnum } from 'src/shared/enum/user.enum';

export class CreateUserDtoV2 {
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 charaters long' })
  @MaxLength(50, { message: 'Title can not be longer than 50 charaters' })
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(5, { message: 'Content must be at least 3 charaters long' })
  email: string;

  @IsNotEmpty({ message: 'Author is required' })
  @IsString({ message: 'Author must be a string' })
  @MinLength(2, { message: 'Author must be at least 2 charaters long' })
  @MaxLength(25, { message: 'Title can not be longer than 25 charaters' })
  password: string;

  phone: string;

  location: string;

  oauthProvider: OAuthProviderEnum;
}
