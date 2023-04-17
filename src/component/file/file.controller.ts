import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { GetFileURLReqDto } from './dto/request/get-file-url.req.dto';
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

  @Get('/list')
  public async getList(@Query() query: UploadFileReqDto) {
    const { request, responseError } = query;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return this.FileService.getList();
  }

  @Get('')
  public async getFileUrl(@Query() query: GetFileURLReqDto) {
    const { request, responseError } = query;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return this.FileService.getFileUrl(request);
  }
}
