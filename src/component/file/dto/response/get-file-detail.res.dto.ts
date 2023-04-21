import { Expose, Type } from 'class-transformer';
import { BaseResDto } from 'src/core/dto/base.res.dto';

class UserResDto extends BaseResDto { }

export class GetFileDetailResDto extends BaseResDto {
  @Expose()
  size: number;

  @Expose()
  @Type(() => UserResDto)
  user: UserResDto;
}
