import { IsNumber, IsString, MaxLength } from 'class-validator';
import { BaseDto } from 'src/core/dto/base.dto';

export class CreateUserReqDto extends BaseDto {
  @IsNumber()
  @MaxLength(20)
  code: string;

  @IsString()
  @MaxLength(255)
  name: string;
}
