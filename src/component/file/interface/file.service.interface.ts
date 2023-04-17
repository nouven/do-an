import { UploadFileReqDto } from '../dto/request/upload-file.req.dto';

export interface FileServiceInterface {
  upload(req: UploadFileReqDto): Promise<any>;
  getList(): Promise<any>;
  getFileUrl(fileName: String): Promise<any>;
}
