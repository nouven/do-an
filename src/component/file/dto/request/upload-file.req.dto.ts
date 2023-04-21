import { Type } from 'class-transformer';
import { BaseReqDto } from 'src/core/dto/base.dto';

export class FileDto {
  data: any;
  filename: any;
  encoding: any;
  mimetype: any;
  limit: any;
}

export class UploadFileReqDto extends BaseReqDto {
  @Type(() => FileDto)
  files: FileDto;
}
