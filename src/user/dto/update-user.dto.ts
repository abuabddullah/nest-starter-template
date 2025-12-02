import { PartialType } from '@nestjs/mapped-types';
import { RoleEnum } from 'src/shared/enum/user.enum';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name?: string;
  email?: string;
  age?: number;
  password?: string;
  role?: RoleEnum;
  avatar?: string;
  phone?: string;
  location?: string;
}
