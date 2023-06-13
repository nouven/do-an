import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTimeLogListReqDto } from 'src/component/time-log/dto/request/get-time-log-list.req.dto';
import { TimeLogRepositoryInterface } from 'src/component/time-log/interface/time-log.repository.interface';
import { BaseAbstractRepository } from 'src/core/repository/base.abstract.repository';
import { TimeLogEntity } from 'src/entity/time-log/time-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TimeLogRepository
  extends BaseAbstractRepository<TimeLogEntity>
  implements TimeLogRepositoryInterface {
  constructor(
    @InjectRepository(TimeLogEntity)
    private readonly timeLogRepository: Repository<TimeLogEntity>,
  ) {
    super(timeLogRepository);
  }

  createEntity(data: any, entity?: TimeLogEntity): TimeLogEntity {
    const timeLogEntity = new TimeLogEntity();
    timeLogEntity.startedAt = data.startedAt;
    timeLogEntity.endedAt = data.endedAt;
    timeLogEntity.action = data.action;
    timeLogEntity.cryptoType = data.cryptoType;
    return timeLogEntity;
  }

  async getList(req: GetTimeLogListReqDto): Promise<any> {
    const { skip, take, filter } = req;
    const query = this.timeLogRepository
      .createQueryBuilder('tl')
      .select([
        'tl.started_at as "startedAt"',
        'tl.ended_at as "endedAt"',
        'tl.action as "action"',
        'tl.cryptoType as "cryptoType"',
      ])
      .orderBy('tl.created_at', 'DESC');

    if (filter) {
      filter.forEach((i) => {
        switch (i.column) {
          case 'action':
            query.where('tl.action LIKE :action', { action: i.text });
            break;
          case 'cryptoType':
            query.andWhere('(tl.cryptoType LIKE :cryptoType)', {
              cryptoType: i.text,
            });
            break;
          default:
            break;
        }
      });
    }

    const data = await query
      .limit(take * 2)
      .offset(skip)
      .getRawMany();

    return data;
  }
}
