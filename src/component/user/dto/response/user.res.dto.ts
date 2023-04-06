import { Expose } from 'class-transformer';

export class UserRes {
  @Expose()
  code: string;

  @Expose()
  email: string;
}
