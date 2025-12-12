import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Version,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RoleEnum } from 'src/shared/enum/user.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';

@Controller('upload')
@Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Version('1')
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileLocally(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file provided');
    }

    const filePath = this.uploadService.uploadFileLocally(file);
    return {
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: filePath,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    };
  }

  @Version('1')
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultipleFilesLocally(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    const filePaths = this.uploadService.uploadMultipleFilesLocally(files);
    return {
      success: true,
      message: 'Files uploaded successfully',
      data: filePaths.map((path, index) => ({
        url: path,
        originalName: files[index].originalname,
        mimeType: files[index].mimetype,
        size: files[index].size,
      })),
    };
  }

  @Version('1')
  @Delete('file/:filename')
  deleteFile(@Param('filename') filename: string) {
    this.uploadService.deleteFile(filename);
    return {
      success: true,
      message: 'File deleted successfully',
    };
  }

  @Version('1')
  @Post('update-file')
  @UseInterceptors(FileInterceptor('file'))
  updateFile(
    @Body('oldFilename') oldFilename: string,
    @UploadedFile() newFile: Express.Multer.File,
  ) {
    if (!oldFilename) {
      throw new Error('oldFilename is required in the request body');
    }

    if (!newFile) {
      throw new Error('No file provided for update');
    }

    const filePath = this.uploadService.updateFile(oldFilename, newFile);

    return {
      success: true,
      message: 'File updated successfully',
      data: {
        url: filePath,
        originalName: newFile.originalname,
        mimeType: newFile.mimetype,
        size: newFile.size,
      },
    };
  }

  @Version('1')
  @Delete('files')
  deleteMultipleFiles(@Body() body: { filenames: string[] }) {
    if (
      !body.filenames ||
      !Array.isArray(body.filenames) ||
      body.filenames.length === 0
    ) {
      throw new Error('filenames array is required in the request body');
    }

    this.uploadService.deleteMultipleFiles(body.filenames);

    return {
      success: true,
      message: 'Files deleted successfully',
      data: {
        count: body.filenames.length,
      },
    };
  }

  @Version('1')
  @Post('update-files')
  @UseInterceptors(FilesInterceptor('files'))
  updateMultipleFiles(
    @Body() body: { updates: Array<{ oldFilename: string }> },
    @UploadedFiles() newFiles: Express.Multer.File[],
  ) {
    if (
      !body.updates ||
      !Array.isArray(body.updates) ||
      body.updates.length === 0
    ) {
      throw new Error('updates array is required in the request body');
    }

    if (!newFiles || newFiles.length === 0) {
      throw new Error('No files provided for update');
    }

    if (body.updates.length !== newFiles.length) {
      throw new Error('Number of updates must match number of files');
    }

    const updates = body.updates.map((update, index) => ({
      oldFilename: update.oldFilename,
      newFile: newFiles[index],
    }));

    const filePaths = this.uploadService.updateMultipleFiles(updates);

    return {
      success: true,
      message: 'Files updated successfully',
      data: filePaths.map((path, index) => ({
        url: path,
        originalName: newFiles[index].originalname,
        mimeType: newFiles[index].mimetype,
        size: newFiles[index].size,
      })),
    };
  }

  @Version('1')
  @Post('field')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileWithFieldLocally(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file provided');
    }

    const filePath = this.uploadService.uploadFileLocally(file);

    return {
      fieldName: file.fieldname,
      file: {
        url: filePath,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    };
  }
}
