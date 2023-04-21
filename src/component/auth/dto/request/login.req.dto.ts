import { IsString } from 'class-validator';
import { BaseReqDto } from 'src/core/dto/base.dto';

export class LoginReqDto extends BaseReqDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
