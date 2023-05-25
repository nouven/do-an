import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { query, response } from 'express';
import { CreateUserReqDto } from './dto/request/create-user.req.dto';
import { UserServiceInterface } from './interface/user.service.interface';
import { isEmpty } from 'lodash';
import { AuthGuard } from 'src/core/guard/verify-token.guard';
import { BaseReqDto } from 'src/core/dto/base.dto';
import { GetUserListDtoReq } from './dto/request/get-user-list.req.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  @Get('ping')
  ping() {
    return this.userService.ping();
  }

  @Post('create')
  public async create(@Body() body: CreateUserReqDto) {
    console.log('<============>   ', 'break');
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.create(request);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  public async getDetail(@Param('id', new ParseIntPipe()) id, @Query() query) {
    return await this.userService.getDetail(id);
  }

  @UseGuards(AuthGuard)
  @Get('/list')
  public async getList(@Query() query: GetUserListDtoReq) {
    const { request, responseError } = query;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.getList(request);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  public async delete(@Param('id', new ParseIntPipe()) id) {
    return await this.userService.delete(id);
  }
}
