import { Expose, Type } from 'class-transformer';
import { BaseResDto } from 'src/core/dto/base.res.dto';

class UserResDto extends BaseResDto { }

export class GetFileListResDto extends BaseResDto {
  @Expose()
  mimetype: string;

  @Expose()
  @Type(() => UserResDto)
  user: UserResDto;
}
