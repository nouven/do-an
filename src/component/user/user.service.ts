import { Inject, Injectable } from '@nestjs/common';
import * as BN from 'bn.js';
import { UserRepository } from 'src/repository/user.repository';
import { CreateUserReqDto } from './dto/request/create-user.req.dto';
import { UserServiceInterface } from './interface/user.service.interface';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepository,
  ) { }

  ping(): any { }

  public async create(req: CreateUserReqDto) {
    const userEntity = this.userRepository.createEntity(req);
    return this.userRepository.create(userEntity);
  }
}
