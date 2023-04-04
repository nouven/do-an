import { Controller, Get } from '@nestjs/common';
import { UserServiceInterface } from './interface/user.service.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserServiceInterface) { }

  @Get('ping')
  ping() {
    return this.userService.ping();
  }
}
