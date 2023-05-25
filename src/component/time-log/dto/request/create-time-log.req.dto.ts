import { BaseReqDto } from 'src/core/dto/base.dto';

export class CreateTimeLogReqDto extends BaseReqDto {
  startedAt: string;
  endedAt: string;
  action: string;
  cryptoType: string;
}
