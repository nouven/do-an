import { Inject, Injectable } from '@nestjs/common';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { ResponseBuilder } from 'src/utils/response-builder';
import { UploadFileReqDto } from './dto/request/upload-file.req.dto';
import { FileServiceInterface } from './interface/file.service.interface';

import { Storage } from '@google-cloud/storage';
import { StorageServiceInterface } from '../storage/interface/storage.service.interface';

@Injectable()
export class FileService implements FileServiceInterface {
  constructor(
    @Inject('StorageServiceInterface')
    private readonly storageService: StorageServiceInterface,
  ) { }

  public async upload(req: UploadFileReqDto): Promise<any> {
    const file = req.files[0];

    const x = await this.storageService.getList();

    return x;

    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }
}
