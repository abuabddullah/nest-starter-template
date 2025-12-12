import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  private getFullPath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }
  uploadFileLocally(file: Express.Multer.File): string {
    if (!file) {
      throw new Error('No file provided');
    }

    // Determine the base path based on file type
    let basePath = '/files/';
    const fileType = file.mimetype.split('/')[0];

    switch (fileType) {
      case 'image':
        basePath += 'images/';
        break;
      case 'video':
        basePath += 'videos/';
        break;
      case 'application':
      case 'text':
        basePath += 'documents/';
        break;
      default:
        basePath += 'others/';
    }

    // Return the full path where the file can be accessed
    return basePath + file.filename;
  }

  uploadMultipleFilesLocally(files: Express.Multer.File[]): string[] {
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    return files.map((file) => this.uploadFileLocally(file));
  }

  deleteFile(filename: string): void {
    if (!filename) {
      throw new Error('No filename provided');
    }

    const filePath = this.getFullPath(filename);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to delete file: ${errorMessage}`);
      }
    } else {
      throw new NotFoundException(`File ${filename} not found`);
    }
  }

  updateFile(oldFilename: string, newFile: Express.Multer.File): string {
    if (!oldFilename || !newFile) {
      throw new Error('Both old filename and new file are required');
    }

    // Delete the old file
    try {
      this.deleteFile(oldFilename);
    } catch (error) {
      // If the old file doesn't exist, we can still proceed with saving the new file
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    // Save the new file
    return this.uploadFileLocally(newFile);
  }

  deleteMultipleFiles(filenames: string[]): void {
    if (!filenames || filenames.length === 0) {
      throw new Error('No filenames provided');
    }

    const results: { filename: string; success: boolean; error?: string }[] =
      [];

    filenames.forEach((filename) => {
      try {
        this.deleteFile(filename);
        results.push({ filename, success: true });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        results.push({
          filename,
          success: false,
          error: errorMessage,
        });
      }
    });

    const failedDeletions = results.filter((r) => !r.success);
    if (failedDeletions.length > 0) {
      const errorMessages = failedDeletions
        .map((f) => `${f.filename}: ${f.error}`)
        .join('; ');
      throw new Error(`Failed to delete some files: ${errorMessages}`);
    }
  }

  updateMultipleFiles(
    updates: { oldFilename: string; newFile: Express.Multer.File }[],
  ): string[] {
    if (!updates || updates.length === 0) {
      throw new Error('No file updates provided');
    }

    const results: string[] = [];
    const errors: string[] = [];

    // First, validate all new files
    for (const update of updates) {
      if (!update.oldFilename || !update.newFile) {
        errors.push(
          'Both oldFilename and newFile are required for each update',
        );
      }
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join('; ')}`);
    }

    // Process updates
    for (const update of updates) {
      try {
        const newPath = this.updateFile(update.oldFilename, update.newFile);
        results.push(newPath);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to update ${update.oldFilename}: ${errorMessage}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Some updates failed: ${errors.join('; ')}`);
    }

    return results;
  }
}
