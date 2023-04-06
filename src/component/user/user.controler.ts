import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { response } from 'express';
import { CreateUserReqDto } from './dto/request/create-user.req.dto';
import { UserServiceInterface } from './interface/user.service.interface';

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
    console.log('<============>   ', responseError);
    return await this.userService.create(request);
  }
}
