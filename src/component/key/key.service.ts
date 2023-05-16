import { Inject, Injectable } from '@nestjs/common';
import { cryptoTypeEnum, SEPR_CHAR } from 'src/constant';
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
    const { key } = req;
    const { id } = req.user;
    const [type] = key.split(SEPR_CHAR);

    const code = await this.generateCode(type);

    const keyEntity = this.keyRepository.createEntity({
      code,
      type,
      publ: key,
      createdBy: id,
    });
    //handle save key
    await this.keyRepository.create(keyEntity);
    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }

  private async generateCode(type: string): Promise<string> {
    const data = await this.keyRepository.getLatestId();
    let id = '1';
    if (data.id) {
      id = (data.id + 1).toString();
    }
    return `${type}.${id.padStart(4, '0')}`;
  }
}
