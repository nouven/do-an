import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
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
    return this.userService.create(body);
  }
}
