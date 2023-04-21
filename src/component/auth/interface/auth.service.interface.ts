import { LoginReqDto } from '../dto/request/login.req.dto';

export interface AuthServiceInterface {
  login(req: LoginReqDto): Promise<any>;
  verifyToken(req: any): Promise<any>;
}
