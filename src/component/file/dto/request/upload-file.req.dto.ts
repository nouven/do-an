import { Type } from 'class-transformer';
import { BaseDto } from 'src/core/dto/base.dto';

export class FileDto {
  data: any;
  filename: any;
  encoding: any;
  mimetype: any;
  limit: any;
}

export class UploadFileReqDto extends BaseDto {
  @Type(() => FileDto)
  files: FileDto;
}
