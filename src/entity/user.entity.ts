import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({})
  username: string;

  @Column({})
  password: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 9,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string;

  @Column({})
  name: string;

  @Column({})
  dateOfBirth: string;

  @Column({})
  phone: string;

  @Column({})
  status: string;

  @Column({})
  updatedAt: string;

  @Column({})
  createdAt: string;

  @Column({})
  deletedAt: string;
}
