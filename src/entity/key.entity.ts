import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from './file.entity';
import { UserEntity } from './user.entity';

@Entity('keys')
export class KeyEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'int',
    unique: true,
  })
  createdBy: number;

  @Column({
    type: 'int',
  })
  type: number;

  @Column({
    type: 'varchar',
  })
  code: string;

  @Column({
    type: 'varchar',
  })
  publ: string;

  @Column({
    type: 'varchar',
  })
  priv: string;

  @Column({})
  updatedAt: string;

  @Column({})
  createdAt: string;

  @Column({})
  deletedAt: string;

  //@ManyToOne(() => UserEntity, (user) => user.keys)
  //user?: UserEntity;

  //@OneToMany(() => FileEntity, (file) => file.key)
  //files?: FileEntity[];
}
