import { IsNumber } from 'class-validator';
import { BaseReqDto } from './base.dto';

export class BaseQueryReqDto extends BaseReqDto {
  @IsNumber()
  page?: number;

  @IsNumber()
  take?: number;

  @IsNumber()
  skip?: number;

  limit: number;

  constructor() {
    super();
    if (!this.page) {
      this.page = 1;
    }
    this.limit = 10;
    this.skip = Number((this.page - 1) * this.limit);
    this.take = Number(this.limit);
  }
}
