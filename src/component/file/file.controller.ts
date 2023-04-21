import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { AuthGuard } from 'src/core/guard/verify-token.guard';
import { GetFileListReqDto } from './dto/request/get-file-list.req.dto';
import { GetFileURLReqDto } from './dto/request/get-file-url.req.dto';
import { UploadFileReqDto } from './dto/request/upload-file.req.dto';
import { FileServiceInterface } from './interface/file.service.interface';

@Controller('files')
export class FileController {
  constructor(
    @Inject('FileServiceInterface')
    private readonly FileService: FileServiceInterface,
  ) { }

  @UseGuards(AuthGuard)
  @Post('/upload')
  public async upload(@Body() body: UploadFileReqDto) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return this.FileService.upload(request);
  }

  @Get('/:id')
  public async getDetail(@Param('id', new ParseIntPipe()) id: number) {
    return this.FileService.getDetail(id);
  }

  @Get('/list')
  public async getList(@Query() query: GetFileListReqDto) {
    const { request, responseError } = query;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return this.FileService.getList(request);
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
