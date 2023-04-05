import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { ApiError } from 'src/utils/api.error';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor() { }
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    if (!value) {
      throw new BadRequestException('No data submitted');
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const message = errors;
      return {
        request: object,
        responseError: new ApiError(ResponseCodeEnum.BAD_REQUEST).toResponse(),
      };
    }
    return {
      request: object,
      responseError: {},
    };
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
