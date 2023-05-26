import { BaseReqDto } from 'src/core/dto/base.dto';

export class GetKeyByUserIdReqDto extends BaseReqDto {
  userId: number;
}
