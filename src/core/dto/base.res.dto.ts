import { Expose } from 'class-transformer';

export class BaseResDto {
  @Expose()
  id: number;

  @Expose()
  code: number;

  @Expose()
  name: number;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
