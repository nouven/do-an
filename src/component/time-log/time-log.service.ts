import { Inject, Injectable } from '@nestjs/common';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { TimeLogEntity } from 'src/entity/time-log.entity';
import { ResponseBuilder } from 'src/utils/response-builder';
import { CreateTimeLogReqDto } from './dto/request/create-time-log.req.dto';
import { GetTimeLogListReqDto } from './dto/request/get-time-log-list.req.dto';
import { TimeLogRepositoryInterface } from './interface/time-log.repository.interface';

@Injectable()
export class TimeLogService {
  constructor(
    @Inject('TimeLogRepositoryInterface')
    private readonly timeLogRepository: TimeLogRepositoryInterface,
  ) { }

  public async create(req: CreateTimeLogReqDto): Promise<any> {
    const timeLogEntity = this.timeLogRepository.createEntity(req);

    await this.timeLogRepository.create(timeLogEntity);

    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }

  public async getList(req: GetTimeLogListReqDto): Promise<any> {
    const data: TimeLogEntity[] = await this.timeLogRepository.getList(req);

    const resData = data.map((i) => {
      const startedAt = new Date(i.startedAt).getTime();
      const endedAt = new Date(i.endedAt).getTime();
      const time = endedAt - startedAt;

      return { time, type: i.type };
    });

    return new ResponseBuilder(resData)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }
}
