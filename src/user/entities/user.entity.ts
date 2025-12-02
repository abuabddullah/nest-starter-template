import {
  OAuthProviderEnum,
  RoleEnum,
  UserStatusEnum,
} from 'src/shared/enum/user.enum';

export class User {
  _id: string;
  name: string;
  role: RoleEnum;
  email: string;
  password?: string;
  image?: string;
  isDeleted: boolean;
  stripeCustomerId: string;
  status: UserStatusEnum;
  verified: boolean;
  googleId?: string;
  facebookId?: string;
  oauthProvider?: OAuthProviderEnum;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
}
