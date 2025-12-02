import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class VerifyOtpDto {
  @IsNumber({}, { message: 'Otp must be a number' })
  @IsNotEmpty({ message: 'Otp is required' })
  otp: number;

  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
