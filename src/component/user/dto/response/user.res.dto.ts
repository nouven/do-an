import { Expose } from 'class-transformer';

export class UserResDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  dateOfBirth: string;

  @Expose()
  phone: string;

  @Expose()
  status: number;
}
