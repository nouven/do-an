import { CreateKeyReqDto } from '../dto/create-key.req.dto';

export interface KeyServiceInterface {
  create(req: CreateKeyReqDto): Promise<any>;
}
