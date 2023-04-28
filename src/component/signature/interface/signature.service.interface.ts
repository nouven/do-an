import { GenerateKeyReqDto } from '../dto/request/generate-key.request.dto';
import { signReqDto } from '../dto/request/sign.req.dto';
import { verifyReqDto } from '../dto/request/verify.req.dto';

export interface SignatureServiceInterface {
  generateKey(req: GenerateKeyReqDto): Promise<any>;
  sign(id: number, req: signReqDto): Promise<any>;
  verify(req: verifyReqDto): Promise<any>;
}
