import { CreateTimeLogReqDto } from '../dto/request/create-time-log.req.dto';
import { GetTimeLogListReqDto } from '../dto/request/get-time-log-list.req.dto';

export interface TimeLogServiceInterface {
  create(req: CreateTimeLogReqDto): Promise<any>;
  getList(req: GetTimeLogListReqDto): Promise<any>;
}
