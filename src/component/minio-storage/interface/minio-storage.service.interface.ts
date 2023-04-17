import { GetFileURLReqDto } from 'src/component/file/dto/request/get-file-url.req.dto';
import { UploadFileReqDto } from 'src/component/file/dto/request/upload-file.req.dto';

export interface MinioStorageServiceInterface {
  uplaod(req: UploadFileReqDto): Promise<any>;
  getList(): Promise<any>;
  getFileUrl(req: GetFileURLReqDto): Promise<any>;
  fGetObject(): Promise<any>;
}
