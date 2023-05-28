import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { CreateTimeLogReqDto } from './dto/request/create-time-log.req.dto';
import { GetTimeLogListReqDto } from './dto/request/get-time-log-list.req.dto';
import { TimeLogServiceInterface } from './interface/time-log.service.interface';

@Controller('time-logs')
export class TimeLogController {
  constructor(
    @Inject('TimeLogServiceInterface')
    private readonly timeLogService: TimeLogServiceInterface,
  ) {}

  @Post('/create')
  public async create(@Body() body: CreateTimeLogReqDto) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.timeLogService.create(request);
  }

  @Get('/list')
  public async getList(@Query() query: GetTimeLogListReqDto) {
    const { request, responseError } = query;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.timeLogService.getList(request);
  }
}
