
import { GetFileListReqDto } from '../dto/request/get-file-list.req.dto';
import { GetFileURLReqDto } from '../dto/request/get-file-url.req.dto';
import { UpdateFileReqDto } from '../dto/request/update-file.req.dto';
import { FileDto, UploadFileReqDto } from '../dto/request/upload-file.req.dto';

export interface FileServiceInterface {
  upload(req: UploadFileReqDto): Promise<any>;
  update(req: UpdateFileReqDto): Promise<any>;
  getList(req: GetFileListReqDto): Promise<any>;
  getDetail(id: number): Promise<any>;
  getObject(fileName): Promise<any>;
  getFileUrl(id: number): Promise<any>;
  delete(id: number): Promise<any>;
  readSignature(buffer: Buffer): Promise<any>;
  write2LatestPage(signature: string, buffer: Buffer): Promise<any>;
  removeLatestPage(buffer: Buffer): Promise<any>;
}
