import { CreateKeyReqDto } from '../dto/create-key.req.dto';
import { GetKeyByUserIdReqDto } from '../dto/get-key-by-user-id.req.dto';

export interface KeyServiceInterface {
  create(req: CreateKeyReqDto): Promise<any>;
  getKeyByUserid(req: GetKeyByUserIdReqDto): Promise<any>;
}
