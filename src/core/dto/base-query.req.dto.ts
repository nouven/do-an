import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { BaseReqDto } from './base.dto';

class FilterReq {
  column: string;
  text: string;
}

export class BaseQueryReqDto extends BaseReqDto {
  @IsNumber()
  page?: number;

  @IsNumber()
  take?: number;

  @IsNumber()
  skip?: number;

  limit: number;

  @Transform(({ value, key }) => {
    try {
      return JSON.parse(`${value}`);
    } catch (err) {
      return [];
    }
  })
  filter?: FilterReq[];

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
