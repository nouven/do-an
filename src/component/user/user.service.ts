import { Inject, Injectable } from '@nestjs/common';
import * as BN from 'bn.js';
import { plainToInstance } from 'class-transformer';
import { ErrorMessageEnum } from 'src/constant/error-message.enum';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { UserRepository } from 'src/repository/user.repository';
import { ResponseBuilder } from 'src/utils/response-builder';
import { Connection } from 'typeorm';
import { CreateUserReqDto } from './dto/request/create-user.req.dto';
import { UserRes } from './dto/response/user.res.dto';
import { UserServiceInterface } from './interface/user.service.interface';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepository,
  ) { }

  public ping(): any {
    let x: BN;
    x = new BN(11, 16);
    return new ResponseBuilder(x).withCode(ResponseCodeEnum.SUCCESS).build();
  }

  public async create(req: CreateUserReqDto) {
    //const userEntity = this.userRepository.createEntity(req);
    //return this.userRepository.create(req);
  }
}
