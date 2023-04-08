import { IsString } from 'class-validator';
import { BaseDto } from 'src/core/dto/base.dto';

export class LoginReqDto extends BaseDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
