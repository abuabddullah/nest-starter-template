import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: any) {
    if (!metatype || metatype === Object) {
      return value;
    }

    const object = plainToClass(metatype, value);

    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = this.flattenValidationErrors(errors);
      throw new BadRequestException(
        `Validation failed: ${messages.join(', ')}`,
      );
    }

    return object;
  }

  private flattenValidationErrors(errors: ValidationError[]): string[] {
    const messages: string[] = [];
    errors.forEach((err) => {
      const constraints = err.constraints ? Object.values(err.constraints) : [];
      messages.push(...constraints);
    });
    return messages;
  }
}
