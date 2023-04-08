import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BaseDto } from 'src/core/dto/base.dto';

export class FileDto {
  data: any;
  filename: any;
  encoding: any;
  mimetype: any;
  limit: any;
}

export class CreateUserReqDto extends BaseDto {
  //@MaxLength(20)
  //@IsString()
  //code: string;

  @MaxLength(20)
  @IsString()
  username: string;

  @IsString()
  password: string;

  @MaxLength(20)
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  dataOfBirth: Date;

  @IsOptional()
  @MaxLength(20)
  @IsString()
  phone: string;
}
