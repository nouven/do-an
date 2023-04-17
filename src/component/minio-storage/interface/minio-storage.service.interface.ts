import { UploadFileReqDto } from 'src/component/file/dto/request/upload-file.req.dto';

export interface MinioStorageServiceInterface {
  uplaod(req: UploadFileReqDto): Promise<any>;
  getList(): Promise<any>;
  getFileUrl(fileName: string): Promise<any>;
}
