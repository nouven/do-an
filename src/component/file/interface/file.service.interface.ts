import { GetFileListReqDto } from '../dto/request/get-file-list.req.dto';
import { GetFileURLReqDto } from '../dto/request/get-file-url.req.dto';
import { UploadFileReqDto } from '../dto/request/upload-file.req.dto';

export interface FileServiceInterface {
  upload(req: UploadFileReqDto): Promise<any>;
  getList(req: GetFileListReqDto): Promise<any>;
  getDetail(id: number): Promise<any>;
  getFileUrl(req: GetFileURLReqDto): Promise<any>;
  readFromLatestPage(buffer: Buffer): Promise<any>;
  write2LatestPage(signature: string, buffer: Buffer): Promise<any>;
  removeLatestPage(buffer: Buffer): Promise<any>;
}
