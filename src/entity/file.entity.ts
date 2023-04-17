import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({})
  fileName: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  code: string;

  @Column({})
  updatedAt: string;

  @Column({})
  createdAt: string;

  @Column({})
  deletedAt: string;
}
