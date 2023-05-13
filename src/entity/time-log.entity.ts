import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('time_logs')
export class TimeLogEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({})
  startedAt: string;

  @Column({})
  endedAt: string;

  @Column({})
  action: string;

  @Column({})
  cryptoType: string;

  @Column({})
  updatedAt: string;

  @Column({})
  createdAt: string;

  @Column({})
  deletedAt: string;
}
