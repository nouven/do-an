import { Inject, Injectable } from '@nestjs/common';
import * as bigi from 'bigi';
import { Point } from 'ecurve';
import { isEmpty } from 'lodash';
import {
  actionEnum,
  AES_ALGORITHM,
  cryptoTypeEnum,
  cryptoTypes,
  SEPR_CHAR,
  SIGNTURE_SIZE,
  verificationResultEnum,
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
import { UserRepositoryInterface } from '../user/interface/user.respository.interface';
import { KeyRepositoryInterface } from '../key/interface/key.repository.interface';
import { TimeLogServiceInterface } from '../time-log/interface/time-log.service.interface';
import { CreateTimeLogReqDto } from '../time-log/dto/request/create-time-log.req.dto';

@Injectable()
export class SignatureService implements SignatureServiceInterface {
  constructor(
    @Inject('FileServiceInterface')
    private readonly fileService: FileServiceInterface,

    @Inject('FileRepositoryInterface')
    private readonly fileRespository: FileRepositoryInterface,

    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @Inject('KeyRepositoryInterface')
    private readonly keyRepository: KeyRepositoryInterface,

    @Inject('TimeLogServiceInterface')
    private readonly timeLogService: TimeLogServiceInterface,
  ) {}

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
    const { userId, publKey } = req;
    const user = await this.userRepository.findOneById(userId);
    if (isEmpty(user)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(ErrorMessageEnum.INVALID_SIGNATURE)
        .build();
    }
    //const key = await this.keyRepository.getKeyByUserId(userId);
    const key = { publ: publKey };

    if (isEmpty(key)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(ErrorMessageEnum.KEY_NOT_FOUND)
        .build();
    }

    const file = req.files[0];
    const buffer = file.data;
    //const signature = await this.fileService.readSignature(uint8);
    let result;

    const signature = removePad(buffer.slice(-SIGNTURE_SIZE)).toString();
    const hashedMsg = hash(buffer.slice(0, -SIGNTURE_SIZE));

    const [type] = signature.split(SEPR_CHAR);
    const [keyType] = key.publ.split(SEPR_CHAR);

    if (keyType !== type) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(ErrorMessageEnum.MESSAGE_IS_CHANGED)
        .build();
    }

    let startedAt, endedAt;
    let cryptoType = cryptoTypeEnum.EC;

    if (type === cryptoTypeEnum.EC) {
      const ec = new EC();
      startedAt = new Date().toISOString();
      result = ec.verify(signature, hashedMsg, key?.publ);
      endedAt = new Date().toISOString();
    } else if (type === cryptoTypeEnum.RSA) {
      const rsa = new RSA();
      cryptoType = cryptoTypeEnum.RSA;
      startedAt = new Date().toISOString();
      result = rsa.verify(signature, hashedMsg, key?.publ);
      endedAt = new Date().toISOString();
    } else {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(ErrorMessageEnum.INVALID_SIGNATURE)
        .build();
    }

    //create time log
    const createTimeLogReq = new CreateTimeLogReqDto();
    createTimeLogReq.startedAt = startedAt;
    createTimeLogReq.endedAt = endedAt;
    createTimeLogReq.cryptoType = cryptoType;
    createTimeLogReq.action = actionEnum.VERIFY;
    await this.timeLogService.create(createTimeLogReq);

    if (result === verificationResultEnum.MESSAGE_IS_CHANGED) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(ErrorMessageEnum.MESSAGE_IS_CHANGED)
        .build();
    } else if (result === verificationResultEnum.PUBLIC_KEY_IS_CHANGED) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(ErrorMessageEnum.PUBLIC_KEY_IS_CHANGED)
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
