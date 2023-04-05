import { CreateUserReqDto } from '../dto/request/create-user.req.dto';

export interface UserServiceInterface {
  ping(): string;
  create(request: CreateUserReqDto): any;
}
