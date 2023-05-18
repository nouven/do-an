import { ResponseBuilder } from 'src/utils/response-builder';
import { CreateUserReqDto } from '../dto/request/create-user.req.dto';
import { GetUserListDtoReq } from '../dto/request/get-user-list.req.dto';
import { UserResDto } from '../dto/response/user.res.dto';

export interface UserServiceInterface {
  ping(): string;
  create(request: CreateUserReqDto): Promise<any>;
  getDetail(id: number): Promise<any>;
  delete(id: number): Promise<any>;
  getList(request: GetUserListDtoReq): any;
  //update(request: CreateUserReqDto): any;
}
