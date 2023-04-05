import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

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
}
