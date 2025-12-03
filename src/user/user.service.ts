// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from './user.schema';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectModel(User.name)
//     private readonly userModel: Model<User>,
//   ) {}

//   async profile(id: string): Promise<User> {
//     const user = await this.userModel.findById(id);

//     if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

//     return user;
//   }
// }

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import QueryBuilder from 'src/shared/helpers/builder/QueryBuilder';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async profile(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id, isDeleted: false });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findAllUnpaginated(): Promise<User[]> {
    return this.userModel.find({ isDeleted: false }).exec();
  }

  async findAll(query: Record<string, unknown>) {
    const queryBuilder = new QueryBuilder<User>(
      this.userModel.find({ isDeleted: false }), // base query
      query,
    )
      .search(['name', 'email', 'phone', 'location']) // searchable fields
      .filter()
      .sort()
      .paginate()
      .fields();

    const meta = await queryBuilder.countTotal();
    const data = await queryBuilder.modelQuery.exec();

    return {
      meta,
      data,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, dto, { new: true });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async remove(id: string): Promise<string> {
    const result = await this.userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    if (!result)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return 'User deleted successfully';
  }
}
