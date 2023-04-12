import { Body, Controller, Inject, Post } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { UploadFileReqDto } from './dto/request/upload-file.req.dto';
import { FileServiceInterface } from './interface/file.service.interface';

@Controller('files')
export class FileController {
  constructor(
    @Inject('FileServiceInterface')
    private readonly FileService: FileServiceInterface,
  ) { }

  @Post('/upload')
  public async upload(@Body() body: UploadFileReqDto) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return this.FileService.upload(request);
  }
}
