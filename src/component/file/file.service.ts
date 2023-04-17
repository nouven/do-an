import { Inject, Injectable, Query } from '@nestjs/common';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { ResponseBuilder } from 'src/utils/response-builder';
import { UploadFileReqDto } from './dto/request/upload-file.req.dto';
import { FileServiceInterface } from './interface/file.service.interface';

import { Storage } from '@google-cloud/storage';
import { MinioStorageServiceInterface } from '../minio-storage/interface/minio-storage.service.interface';
import { GetFileURLReqDto } from './dto/request/get-file-url.req.dto';
import { isEmpty } from 'lodash';

@Injectable()
export class FileService implements FileServiceInterface {
  constructor(
    @Inject('MinioStorageServiceInterface')
    private readonly minioStorageService: MinioStorageServiceInterface,
  ) { }

  public async upload(req: UploadFileReqDto): Promise<any> {
    return this.minioStorageService.uplaod(req);
  }

  public async getList(): Promise<any> {
    return this.minioStorageService.getList();
  }

  public async getFileUrl(req: GetFileURLReqDto): Promise<any> {
    return this.minioStorageService.getFileUrl(req);
  }
}
