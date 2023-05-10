import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeLogEntity } from 'src/entity/time-log.entity';
import { TimeLogRepository } from 'src/repository/time-log.repository';
import { TimeLogController } from './time-log.controller';
import { TimeLogService } from './time-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimeLogEntity])],
  exports: [],
  controllers: [TimeLogController],
  providers: [
    {
      provide: 'TimeLogServiceInterface',
      useClass: TimeLogService,
    },
    {
      provide: 'TimeLogRepositoryInterface',
      useClass: TimeLogRepository,
    },
  ],
})
export class TimeLogModule { }
