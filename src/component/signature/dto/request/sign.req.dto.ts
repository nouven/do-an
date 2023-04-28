import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { FileDto } from 'src/component/file/dto/request/upload-file.req.dto';
import { BaseReqDto } from 'src/core/dto/base.dto';

export class signReqDto extends BaseReqDto {
  @IsString()
  @IsOptional()
  priv: string;
}
