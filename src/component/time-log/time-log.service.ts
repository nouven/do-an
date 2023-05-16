import { Inject, Injectable } from '@nestjs/common';
import { actionEnum, cryptoTypeEnum } from 'src/constant';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { TimeLogEntity } from 'src/entity/time-log.entity';
import { ResponseBuilder } from 'src/utils/response-builder';
import { CreateTimeLogReqDto } from './dto/request/create-time-log.req.dto';
import { GetTimeLogListReqDto } from './dto/request/get-time-log-list.req.dto';
import { TimeLogRepositoryInterface } from './interface/time-log.repository.interface';
import { TimeLogServiceInterface } from './interface/time-log.service.interface';

@Injectable()
export class TimeLogService implements TimeLogServiceInterface {
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
    //const data: TimeLogEntity[] = await this.timeLogRepository.getList(req);
    //const resData = data.map((i) => {
    //  const startedAt = new Date(i.startedAt).getTime();
    //  const endedAt = new Date(i.endedAt).getTime();
    //  const time = endedAt - startedAt;
    //  return { time, cryptoType: i.cryptoType, action: i.action };
    //});

    const [keyLogTimesEc, keyLogTimesRsa, signLogTimesEc, signLogTimesRsa] =
      await Promise.all([
        this.timeLogRepository.getList({
          ...req,
          filter: [
            { column: 'action', text: actionEnum.GENERATE_KEY },
            { column: 'cryptoType', text: cryptoTypeEnum.EC },
          ],
        }),
        this.timeLogRepository.getList({
          ...req,
          filter: [
            { column: 'action', text: actionEnum.GENERATE_KEY },
            { column: 'cryptoType', text: cryptoTypeEnum.RSA },
          ],
        }),
        this.timeLogRepository.getList({
          ...req,
          filter: [
            { column: 'action', text: actionEnum.SIGN },
            { column: 'cryptoType', text: cryptoTypeEnum.EC },
          ],
        }),
        this.timeLogRepository.getList({
          ...req,
          filter: [
            { column: 'action', text: actionEnum.SIGN },
            { column: 'cryptoType', text: cryptoTypeEnum.RSA },
          ],
        }),
      ]);

    const resData = {
      keyLogTimes: this.generateResponse(keyLogTimesEc).concat(
        this.generateResponse(keyLogTimesRsa),
      ),
      signLogTimes: this.generateResponse(signLogTimesEc).concat(
        this.generateResponse(signLogTimesRsa),
      ),
    };

    return new ResponseBuilder(resData)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }
  private generateResponse(data: TimeLogEntity[]): any[] {
    return data.map((i) => {
      const startedAt = new Date(i.startedAt).getTime();
      const endedAt = new Date(i.endedAt).getTime();
      const time = endedAt - startedAt;
      return { time, cryptoType: i.cryptoType, action: i.action };
    });
  }
}
