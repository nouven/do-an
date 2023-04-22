import { GetFileURLReqDto } from 'src/component/file/dto/request/get-file-url.req.dto';
import { UploadFileReqDto } from 'src/component/file/dto/request/upload-file.req.dto';
import { FileDto } from 'src/component/user/dto/request/create-user.req.dto';

export interface MinioStorageServiceInterface {
  upload(req: FileDto): Promise<any>;
  getList(): Promise<any>;
  getFileUrl(fileName: string): Promise<any>;
  fGetObject(): Promise<any>;
  removeObject(fileName: string): Promise<any>;
  getObject(fileName: string): Promise<any>;
}
