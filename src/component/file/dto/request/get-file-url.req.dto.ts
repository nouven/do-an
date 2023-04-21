import { IsString } from 'class-validator';
import { BaseReqDto } from 'src/core/dto/base.dto';

export class GetFileURLReqDto extends BaseReqDto {
  @IsString()
  fileName: string;
}
