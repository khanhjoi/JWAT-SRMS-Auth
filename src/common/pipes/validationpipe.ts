import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);


    if (errors.length > 0) {
      const messages = this.formatErrors(errors);
      throw new BadRequestException({
        messages: messages,
      });
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]): string[] {
    const result = [];
 
    for (const error of errors) {
      if (error.children && error.children.length > 0) {
        result.push(...this.formatErrors(error.children));
      } else {
        for (const constraint of Object.values(error.constraints)) { 
          result.push(constraint);
        }
      }
    }
    return result;
  }
}
