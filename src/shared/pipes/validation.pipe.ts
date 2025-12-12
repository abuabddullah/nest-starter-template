// src/shared/pipes/validation.pipe.ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // Skip if no metatype or it's a native JS type
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: this.buildError(errors),
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private buildError(errors: any[]) {
    const result: any = {};
    for (const error of errors) {
      result[error.property] = Object.values(error.constraints ?? {});
    }
    return result;
    // Or flatten to strings if you prefer:
    // return errors.map(e => Object.values(e.constraints ?? {})).flat();
  }
}
