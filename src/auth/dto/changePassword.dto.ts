import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString({ message: 'old password must be a string' })
  @IsNotEmpty({ message: 'old password is required' })
  old_password: string;

  @IsString({ message: 'Confirm password must be a string' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirm_password: string;
}
