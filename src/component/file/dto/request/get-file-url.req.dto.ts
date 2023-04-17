import { IsString } from 'class-validator';
import { BaseDto } from 'src/core/dto/base.dto';

export class GetFileURLReqDto extends BaseDto {
  @IsString()
  fileName: string;
}
