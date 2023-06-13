import { BaseInterfaceRepository } from 'src/core/repository/base.interface.repository';
import { FileEntity } from 'src/entity/file/file.entity';
import { GetFileListReqDto } from '../dto/request/get-file-list.req.dto';

export interface FileRepositoryInterface
  extends BaseInterfaceRepository<FileEntity> {
  getLatestId(): Promise<any>;
  getList(req: GetFileListReqDto): Promise<any>;
  getDetail(id: number): Promise<any>;
}
