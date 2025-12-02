import { RoleEnum } from '../enum/user.enum';

export interface IJwtPayload {
  userId: string;
  roles: RoleEnum[];
}
