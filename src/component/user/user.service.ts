import { Inject, Injectable } from '@nestjs/common';
import * as BN from 'bn.js';
import { plainToInstance } from 'class-transformer';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { UserRepository } from 'src/repository/user.repository';
import { ResponseBuilder } from 'src/utils/response-builder';
import { CreateUserReqDto } from './dto/request/create-user.req.dto';
import { UserResDto } from './dto/response/user.res.dto';
import { UserServiceInterface } from './interface/user.service.interface';
import * as bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';

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

  public async create(req: CreateUserReqDto): Promise<any> {
    const { password } = req;

    const hashedPass = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const code = await this.generateCode();

    const userEntity = this.userRepository.createEntity({
      ...req,
      code,
      password: hashedPass,
    });
    const user = await this.userRepository.create(userEntity);

    const resData = plainToInstance(UserResDto, user, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(resData).withCode(ResponseCodeEnum.SUCCESS);
  }

  public async getDetail(id: number): Promise<any> {
    const data = await this.userRepository.findOneById(id);

    if (isEmpty(data)) {
      return new ResponseBuilder().withCode(ResponseCodeEnum.NOT_FOUND);
    }

    const resData = plainToInstance(UserResDto, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(resData).withCode(ResponseCodeEnum.SUCCESS);
  }

  public async delete(id: number): Promise<any> {
    const data = await this.userRepository.findOneById(id);
    if (isEmpty(data)) {
      return new ResponseBuilder().withCode(ResponseCodeEnum.NOT_FOUND);
    }
    await this.userRepository.softDelete(id);

    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS);
  }

  private async generateCode(): Promise<string> {
    const data = await this.userRepository.getLatestId();
    let id = '1';
    if (data.id) {
      id = (data.id + 1).toString();
    }
    const code = `U.${id.padStart(4, '0')}`;
    return code;
  }
}
