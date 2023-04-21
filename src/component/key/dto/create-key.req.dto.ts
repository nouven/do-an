import { IsEnum } from 'class-validator';
import { SignEnum } from 'src/constant';
import { BaseReqDto } from 'src/core/dto/base.dto';

export class CreateKeyReqDto extends BaseReqDto {
  @IsEnum(SignEnum)
  type: number;
}
