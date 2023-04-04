import { Injectable } from '@nestjs/common';
import { UserServiceInterface } from './interface/user.service.interface';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor() { }

  ping(): string {
    return 'pong';
  }
}
