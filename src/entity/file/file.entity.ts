import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({})
  name: string;

  @Column({
    type: 'int',
  })
  createdBy: number;

  @Column({
    type: 'int',
  })
  keyId: number;

  @Column({})
  mimetype: string;

  @Column({})
  isShared: boolean;

  @Column({})
  isSigned: number;

  @Column({})
  updatedAt: string;

  @Column({})
  createdAt: string;

  @Column({})
  deletedAt: string;

  //@ManyToOne(() => UserEntity, (user) => user.files)
  //user?: UserEntity;

  //@ManyToOne(() => KeyEntity, (key) => key.files)
  //key?: KeyEntity;
}
