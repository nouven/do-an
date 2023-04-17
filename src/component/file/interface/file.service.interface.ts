import { GetFileURLReqDto } from '../dto/request/get-file-url.req.dto';
import { UploadFileReqDto } from '../dto/request/upload-file.req.dto';

export interface FileServiceInterface {
  upload(req: UploadFileReqDto): Promise<any>;
  getList(): Promise<any>;
  getFileUrl(req: GetFileURLReqDto): Promise<any>;
}
