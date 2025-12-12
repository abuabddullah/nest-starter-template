import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  Version,
  UsePipes,
  ValidationPipe,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtThrottlerGuard } from 'src/shared/guards/jwt.throttler.guard';
import { RoleEnum } from 'src/shared/enum/user.enum';
import { diskStorage } from 'multer';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/objectId.pipe';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // -------------------------------
  // CURRENT USER PROFILE
  // -------------------------------
  @Version('1')
  @Get('/profile')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, JwtThrottlerGuard)
  profile(@Req() req: any) {
    return this.userService.profile(req.user.id);
  }

  // -------------------------------
  // GET ALL USERS unpaginated
  // -------------------------------
  @Version('1')
  @Get('/unpaginated')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, JwtThrottlerGuard)
  findAllUnpaginated() {
    return this.userService.findAllUnpaginated();
  }
  @Version('1')
  @Get('/')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, JwtThrottlerGuard)
  findAll(@Query() query: Record<string, unknown>) {
    return this.userService.findAll(query);
  }
  // -------------------------------
  // GET USER BY ID
  // -------------------------------
  @Version('1')
  @Get('/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, JwtThrottlerGuard)
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.findOne(id);
  }

  // -------------------------------
  // UPDATE USER
  // -------------------------------
  @Version('1')
  @Put('/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, JwtThrottlerGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto);
  }

  // -------------------------------
  // PATCH USER
  // -------------------------------
  @Version('1')
  @Patch('/:id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let destination: string;
          if (file.fieldname === 'video') {
            destination = './uploads/videos';
          } else if (
            file.fieldname === 'couverture' ||
            file.fieldname === 'avatar' ||
            file.fieldname === 'image' ||
            file.fieldname === 'images'
          ) {
            destination = './uploads/images';
          } else if (file.fieldname === 'document') {
            destination = './uploads/documents';
          } else {
            destination = './uploads/others';
          }
          cb(null, destination);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.mimetype.split('/')[1];
          cb(
            null,
            `${file.fieldname}_${file.originalname}_${uniqueSuffix}.${extension}`,
          );
        },
      }),
    }),
  )
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, JwtThrottlerGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  patch(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    console.log('🚀 ~ UserController ~ patch ~ dto:', dto);
    if (files) {
      const avatarFile = files['avatar'][0];
      dto.avatar = '/images/' + avatarFile.filename;
    }
    return this.userService.update(id, dto);
  }

  // -------------------------------
  // DELETE USER
  // -------------------------------
  @Version('1')
  @Delete('/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, JwtThrottlerGuard)
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.remove(id);
  }
}
