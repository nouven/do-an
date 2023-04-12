import { UploadFileReqDto } from '../dto/request/upload-file.req.dto';

export interface FileServiceInterface {
  upload(req: UploadFileReqDto): Promise<any>;
}
