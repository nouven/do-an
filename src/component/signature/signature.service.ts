import { Inject, Injectable } from '@nestjs/common';
import * as bigi from 'bigi';
import { isEmpty } from 'lodash';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { EC } from 'src/signature/ec';
import { deKey, hash, key2Json } from 'src/utils';
import { ResponseBuilder } from 'src/utils/response-builder';
import { FileDto } from '../file/dto/request/upload-file.req.dto';
import { FileRepositoryInterface } from '../file/interface/file.repository.interface';
import { FileServiceInterface } from '../file/interface/file.service.interface';
import { GenerateKeyReqDto } from './dto/request/generate-key.request.dto';
import { signReqDto } from './dto/request/sign.req.dto';
import { verifyReqDto } from './dto/request/verify.req.dto';
import { SignatureServiceInterface } from './interface/signature.service.interface';

const priv = 'secp256k1**80b7643b397a76cfea31f851';
const publ =
  'secp256k1**92b7d35e77c5135ff59a29d5c250d57b679e2be2403a9c3024ed7f615e97784d**10699215940994f069226aabbffd5fb29f0eeaf62a8f72633200d7a4ebd2fc87**61ad0a1c00d08d528dadd31e308663fbb1478d22e6fbe85e545d9d2eedc236fc**';

@Injectable()
export class SignatureService implements SignatureServiceInterface {
  constructor(
    @Inject('FileServiceInterface')
    private readonly fileService: FileServiceInterface,

    @Inject('FileRepositoryInterface')
    private readonly fileRespository: FileRepositoryInterface,
  ) { }

  public async generateKey(req: GenerateKeyReqDto): Promise<any> {
    const ec = new EC('secp256k1');
    const key = ec.generateKey();
    const resKey = key2Json(ec.name, key.priv, key.publ);
    return new ResponseBuilder(resKey).withCode(ResponseCodeEnum.SUCCESS);
  }

  public async sign(id: number, req: signReqDto): Promise<any> {
    const file = await this.fileRespository.findOneById(id);
    if (isEmpty(file)) {
      return new ResponseBuilder().withCode(ResponseCodeEnum.NOT_FOUND);
    }

    const { size, data } = await this.fileService.getObject(file.name);

    const hashedData = hash(data);
    const m = bigi.fromHex(hashedData);

    const [curve, priv] = deKey(req.priv);
    const ec = new EC(curve);
    const signature = ec.sign(m, priv);

    console.log('<<==========>>	', signature);

    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS);
  }

  public async verify(req: verifyReqDto): Promise<any> { }
}
