import { Inject, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
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
    const isMatching = await compare(password, user.password);

    if (!isMatching) {
      return new ResponseBuilder().withCode(ResponseCodeEnum.UNAUTHORIZED);
    }

    const payload = {
      id: user.id,
      code: user.code,
      email: user.email,
    };

    const token = sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '1d',
    });

    return new ResponseBuilder(token).withCode(ResponseCodeEnum.SUCCESS);
  }
}
