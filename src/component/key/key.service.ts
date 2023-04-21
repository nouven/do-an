import { Inject, Injectable } from '@nestjs/common';
import { PrefixKeyCodeEnum, SignEnum } from 'src/constant';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { ResponseBuilder } from 'src/utils/response-builder';
import { CreateKeyReqDto } from './dto/create-key.req.dto';
import { KeyRepositoryInterface } from './interface/key.repository.interface';
import { KeyServiceInterface } from './interface/key.service.interface';

@Injectable()
export class KeyService implements KeyServiceInterface {
  constructor(
    @Inject('KeyRepositoryInterface')
    private readonly keyRepository: KeyRepositoryInterface,
  ) { }
  public async create(req: CreateKeyReqDto): Promise<any> {
    const { type } = req;
    const { id } = req.user;
    const code = await this.generateCode(type);
    //handle generate key

    //handle save key
    return new ResponseBuilder({ code }).withCode(ResponseCodeEnum.SUCCESS);
  }

  private async generateCode(type: number): Promise<string> {
    const data = await this.keyRepository.getLatestId();
    let id = '1';
    if (data.id) {
      id = (data.id + 1).toString();
    }
    if (type === SignEnum.STAND_EC) {
      return `${PrefixKeyCodeEnum.STAND_EC}.${id.padStart(4, '0')}`;
    }
    if (type === SignEnum.ENHANDCED_EC) {
      return `${PrefixKeyCodeEnum.ENHANDCED_EC}.${id.padStart(4, '0')}`;
    }
  }
}
