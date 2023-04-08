import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { response } from 'express';
import { CreateUserReqDto } from './dto/request/create-user.req.dto';
import { UserServiceInterface } from './interface/user.service.interface';
import { isEmpty } from 'lodash';

@Controller('users')
export class UserController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) { }

  @Get('ping')
  ping() {
    return this.userService.ping();
  }

  @Post('create')
  public async create(@Body() body: CreateUserReqDto) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.create(request);
  }

  @Get(':id')
  public async getDetail(@Param('id', new ParseIntPipe()) id) {
    return await this.userService.getDetail(id);
  }

  @Delete(':id')
  public async delete(@Param('id', new ParseIntPipe()) id) {
    return await this.userService.delete(id);
  }
}
