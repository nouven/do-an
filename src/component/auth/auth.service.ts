import { Inject, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { isEmpty } from 'lodash';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { ResponseBuilder } from 'src/utils/response-builder';
import { UserRepositoryInterface } from '../user/interface/user.respository.interface';
import { LoginReqDto } from './dto/request/login.req.dto';
import { AuthServiceInterface } from './interface/auth.service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) { }

  public async login(req: LoginReqDto): Promise<any> {
    const { username, password } = req;
    const user = await this.userRepository.findOneByCondition({
      username,
    });

    if (isEmpty(user)) {
      return new ResponseBuilder().withCode(ResponseCodeEnum.NOT_FOUND).build();
    }

    const isMatching = await compare(password, user.password);

    if (!isMatching) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.UNAUTHORIZED)
        .build();
    }

    const payload = {
      id: user.id,
      code: user.code,
      email: user.email,
      name: user.name,
    };

    const token = sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '7d',
    });

    return new ResponseBuilder({ accessToken: token, user: payload })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async verifyToken(req: any): Promise<any> {
    return new ResponseBuilder({ user: req.user })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }
}
