import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import appConfig from 'src/config/app.config';
import { RoleEnum } from 'src/shared/enum/user.enum';
import { User } from 'src/user/user.schema';

type AppConfig = ReturnType<typeof appConfig>;

@Injectable()
export class DatabaseService {
  private readonly config: AppConfig;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    this.config = appConfig();
  }

  async createSuperAdmin() {
    try {
      const existingSuperAdmin = await this.userModel.findOne({
        role: RoleEnum.SUPER_ADMIN,
      });

      if (existingSuperAdmin) {
        console.log('Super admin already exists.');
        return;
      }

      const superAdminName = this.config.admin.super_admin_name;
      const superAdminEmail = this.config.admin.super_admin_email;
      const superAdminPassword = this.config.admin.super_admin_password;

      await this.userModel.create({
        name: superAdminName,
        email: superAdminEmail,
        password: superAdminPassword,
        role: RoleEnum.SUPER_ADMIN,
      });

      console.log('Super user created successfully!');
    } catch (error) {
      console.log('Error creating super user', error);
    }
  }
}
