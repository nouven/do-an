import { Type } from 'class-transformer';
import { FileDto } from 'src/component/file/dto/request/upload-file.req.dto';
import { BaseReqDto } from 'src/core/dto/base.dto';

export class DecryptReqDto extends BaseReqDto {
  @Type(() => FileDto)
  files: FileDto[];

  key: string;
}
