import { DecryptReqDto } from '../dto/request/decrypt.req.dto';
import { EncryptReqDto } from '../dto/request/encrypt.req.dto';
import { GenerateKeyReqDto } from '../dto/request/generate-key.request.dto';
import { SignReqDto } from '../dto/request/sign.req.dto';
import { VerifyReqDto } from '../dto/request/verify.req.dto';

export interface SignatureServiceInterface {
  generateKey(req: GenerateKeyReqDto): Promise<any>;
  sign(id: number, req: SignReqDto): Promise<any>;
  verify(req: VerifyReqDto): Promise<any>;
  encrypt(req: EncryptReqDto): Promise<any>;
  decrypt(req: DecryptReqDto): Promise<any>;
}
