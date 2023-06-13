import { BaseInterfaceRepository } from 'src/core/repository/base.interface.repository';
import { TimeLogEntity } from 'src/entity/time-log/time-log.entity';
import { GetTimeLogListReqDto } from '../dto/request/get-time-log-list.req.dto';

export interface TimeLogRepositoryInterface
  extends BaseInterfaceRepository<TimeLogEntity> {
  getList(req: GetTimeLogListReqDto): Promise<any>;
}
