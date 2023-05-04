import { Inject, Injectable } from '@nestjs/common';
import * as bigi from 'bigi';
import { Point } from 'ecurve';
import { isEmpty } from 'lodash';
import { cryptoTypeEnum, cryptoTypes, SEPR_CHAR } from 'src/constant';
import { ErrorMessageEnum } from 'src/constant/error-message.enum';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { EC } from 'src/signature/ec';
import { RSA } from 'src/signature/rsa';
import { str2arr, hash, key2Json, sign2Str } from 'src/utils';
import { ResponseBuilder } from 'src/utils/response-builder';
import { FileDto } from '../file/dto/request/upload-file.req.dto';
import { FileRepositoryInterface } from '../file/interface/file.repository.interface';
import { FileServiceInterface } from '../file/interface/file.service.interface';
import { GenerateKeyReqDto } from './dto/request/generate-key.request.dto';
import { signReqDto } from './dto/request/sign.req.dto';
import { verifyReqDto } from './dto/request/verify.req.dto';
import { SignatureServiceInterface } from './interface/signature.service.interface';

@Injectable()
export class SignatureService implements SignatureServiceInterface {
  constructor(
    @Inject('FileServiceInterface')
    private readonly fileService: FileServiceInterface,

    @Inject('FileRepositoryInterface')
    private readonly fileRespository: FileRepositoryInterface,
  ) { }

  public async generateKey(req: GenerateKeyReqDto): Promise<any> {
    //const ec = new EC();
    //const key = ec.generateKey();
    //const resKey = key2Json(ec.name, key.priv, key.publ);
    //return new ResponseBuilder(resKey).withCode(ResponseCodeEnum.SUCCESS);
  }

  public async sign(id: number, req: signReqDto): Promise<any> {
    //const file = await this.fileRespository.findOneById(id);
    //if (isEmpty(file)) {
    //  return new ResponseBuilder().withCode(ResponseCodeEnum.NOT_FOUND);
    //}
    //const { size, data } = await this.fileService.getObject(file.name);
    //const hashedData = hash(data);
    //console.log('<============>   sign: hasheddata :', hashedData);
    //const m = bigi.fromHex(hashedData);
    //const [curve, priv] = str2arr(req.priv);
    //const ec = new EC(curve);
    //let signature: any = ec.sign(m, priv);
    //const publ = ec.getPublKey(priv);
    //signature = sign2Str(ec.name, [
    //  signature.r,
    //  signature.s,
    //  publ.x,
    //  publ.y,
    //  publ.z,
    //]);
    //const signedBytes = await this.fileService.write2LatestPage(
    //  signature,
    //  data,
    //);
    //const fileDto = new FileDto();
    //fileDto.data = signedBytes;
    //fileDto.filename = file.name;
    //fileDto.mimetype = file.mimetype;
    //file.isSigned = 1;
    //await this.fileService.update(fileDto, file);
    //return new ResponseBuilder(signature).withCode(ResponseCodeEnum.SUCCESS);
  }

  public async verify(req: verifyReqDto): Promise<any> {
    const file = req.files[0];
    const uint8 = file.data;
    const signature = await this.fileService.readSignature(uint8);
    let result = false;

    const [type] = signature.split(SEPR_CHAR);
    if (type === cryptoTypeEnum.EC) {
      const ec = new EC();
      result = ec.verify(signature);
    } else if (type === cryptoTypeEnum.RSA) {
      const rsa = new RSA();
      result = rsa.verify(signature);
    } else {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(ErrorMessageEnum.INVALID_SIGNATURE);
    }
    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(ErrorMessageEnum.INVALID_SIGNATURE);
    }
    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS);
  }
}
