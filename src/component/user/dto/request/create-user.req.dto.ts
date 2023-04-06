import { IsNumber, IsString, MaxLength } from 'class-validator';
import { BaseDto } from 'src/core/dto/base.dto';

export class CreateUserReqDto extends BaseDto {
  @IsString()
  @MaxLength(20)
  code: string;

  @MaxLength(20)
  @IsString()
  email: string;
}
