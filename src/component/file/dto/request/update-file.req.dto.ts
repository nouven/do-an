import { BaseReqDto } from 'src/core/dto/base.dto';

export class UpdateFileReqDto extends BaseReqDto {
  id: number;
  isShared: boolean;
}
