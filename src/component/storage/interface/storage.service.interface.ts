import { FileDto } from 'src/component/file/dto/request/upload-file.req.dto';

export interface StorageServiceInterface {
  save(req: FileDto): Promise<any>;
  get(path: string): Promise<any>;
  getList(): Promise<any>;
}
