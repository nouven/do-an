import { Inject, Injectable } from '@nestjs/common';
import * as bigi from 'bigi';
import { Point } from 'ecurve';
import { isEmpty } from 'lodash';
import {
  AES_ALGORITHM,
  cryptoTypeEnum,
  cryptoTypes,
  SEPR_CHAR,
  SIGNTURE_SIZE,
} from 'src/constant';
import { ErrorMessageEnum } from 'src/constant/error-message.enum';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { RSA } from 'src/feature/rsa/rsa';
import { str2arr, hash, key2Json, sign2Str, removePad } from 'src/utils';
import { ResponseBuilder } from 'src/utils/response-builder';
import { FileDto } from '../file/dto/request/upload-file.req.dto';
import { FileRepositoryInterface } from '../file/interface/file.repository.interface';
import { FileServiceInterface } from '../file/interface/file.service.interface';
import { DecryptReqDto } from './dto/request/decrypt.req.dto';
import { EncryptReqDto } from './dto/request/encrypt.req.dto';
import { GenerateKeyReqDto } from './dto/request/generate-key.request.dto';
import { SignReqDto } from './dto/request/sign.req.dto';
import { VerifyReqDto } from './dto/request/verify.req.dto';
import { SignatureServiceInterface } from './interface/signature.service.interface';
import * as crypto from 'crypto';
import { EC } from 'src/feature/ec/ec-1';

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

  public async sign(id: number, req: SignReqDto): Promise<any> {
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

  public async verify(req: VerifyReqDto): Promise<any> {
    const file = req.files[0];
    const buffer = file.data;
    //const signature = await this.fileService.readSignature(uint8);
    let result = false;

    const signature = removePad(buffer.slice(-SIGNTURE_SIZE)).toString();
    const hashedMsg = hash(buffer.slice(0, -SIGNTURE_SIZE));

    const [type] = signature.split(SEPR_CHAR);
    if (type === cryptoTypeEnum.EC) {
      const ec = new EC();
      result = ec.verify(signature, hashedMsg);
    } else if (type === cryptoTypeEnum.RSA) {
      const rsa = new RSA();
      result = rsa.verify(signature, hashedMsg);
    } else {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(ErrorMessageEnum.INVALID_SIGNATURE)
        .build();
    }
    if (!result) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(ErrorMessageEnum.INVALID_SIGNATURE)
        .build();
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(ErrorMessageEnum.VALID_SIGNATURE)
      .build();
  }

  public async encrypt(req: EncryptReqDto): Promise<any> {
    const file = req.files[0];
    const key = req.key;
    const buffer = file.data;
    const iv = crypto.randomBytes(16);
    //const key = crypto
    //  .createHash('sha256')
    //  .update('nouven')
    //  .digest('hex')
    //  .substring(0, 32);

    const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv);
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);

    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }
  public async decrypt(req: DecryptReqDto): Promise<any> {
    const file = req.files[0];
    const key = req.key;
    const buffer = file.data;

    const iv = buffer.slice(0, 16);
    //const key = crypto
    //  .createHash('sha256')
    //  .update('nouven')
    //  .digest('hex')
    //  .substring(0, 32);

    const signature = removePad(buffer.slice(-SIGNTURE_SIZE));

    const cipher = buffer.slice(16, -SIGNTURE_SIZE);
    const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, iv);

    const result = Buffer.concat([decipher.update(cipher), decipher.final()]);
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }
}
