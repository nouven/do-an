import { IsOptional, IsString } from 'class-validator';
import { BaseReqDto } from 'src/core/dto/base.dto';

export class GenerateKeyReqDto extends BaseReqDto {
  @IsString()
  @IsOptional()
  type: string;
}
