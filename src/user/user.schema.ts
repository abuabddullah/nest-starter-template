import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Document, Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { OAuthProviderEnum, RoleEnum } from 'src/shared/enum/user.enum';

@Schema({ timestamps: true })
export class User extends Document {
  // Personal info

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
  })
  phone: string;

  @Prop({
    type: String,
  })
  location: string;

  @Prop({
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v: string) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
      message: (props) => `${props.value} is not a valid email address!`,
    },
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: function (this: CreateUserDto) {
      return !this.oauthProvider; // only required if NOT oauth user
    },
    select: false,
  })
  password: string;

  @Prop({
    type: Number,
    default: 0,
  })
  age: number;

  @Prop({
    enum: RoleEnum,
    default: RoleEnum.USER,
    required: false,
  })
  role: RoleEnum;

  @Prop({
    type: String,
    enum: OAuthProviderEnum,
    required: false,
  })
  oauthProvider: OAuthProviderEnum;

  @Prop({
    type: String,
    default: 'https://i.ibb.co/z5YHLV9/profile.png',
  })
  avatar: string;

  // Auth related fields

  @Prop({
    type: Boolean,
    default: false,
  })
  isVerified: boolean;

  @Prop({
    type: Number,
    default: null,
    min: [1000, 'OTP must be a 4-digit number!'],
    max: [999999, 'OTP must be a number between 1000 and 999999!'],
  })
  otp?: number;

  @Prop({
    default: null,
    type: Date,
  })
  otpExpiry?: Date;

  @Prop({
    type: String,
    default: null,
  })
  refreshToken?: string;

  @Prop({
    type: String,
    default: null,
  })
  resetPasswordToken?: string;

  @Prop({
    type: Date,
    default: null,
  })
  resetPasswordTokenExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Set TTL to remove the document 5 minutes after otpExpiry
UserSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 5 * 60 });

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.statics.comparePassword = async function (
  loginPassword: string,
  storedPassword: string,
): Promise<boolean> {
  if (!loginPassword || !storedPassword) {
    console.error(
      'Invalid password arguments: ',
      loginPassword,
      storedPassword,
    );
    throw new Error('Password comparison failed due to invalid arguments');
  }

  return await bcrypt.compare(loginPassword, storedPassword);
};

export interface UserModel extends Model<User> {
  comparePassword: (
    loginPassword: string,
    storedPassword: string,
  ) => Promise<boolean>;
}
