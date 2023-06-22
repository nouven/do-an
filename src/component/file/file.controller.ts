import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { AuthGuard } from 'src/core/guard/verify-token.guard';
import { GetFileListReqDto } from './dto/request/get-file-list.req.dto';
import { GetFileURLReqDto } from './dto/request/get-file-url.req.dto';
import { UpdateFileReqDto } from './dto/request/update-file.req.dto';
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

  @UseGuards(AuthGuard)
  @Delete('/:id')
  public async delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.FileService.delete(id);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  public async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateFileReqDto,
  ) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return this.FileService.update({ id, ...request });
  }

  @UseGuards(AuthGuard)
  @Get('/list')
  public async getList(@Query() query: GetFileListReqDto) {
    const { request, responseError } = query;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return this.FileService.getList(request);
  }

  @Get('/file-url/:id')
  public async getFileUrl(@Param('id', new ParseIntPipe()) id: number) {
    return this.FileService.getObject(id);
  }
}
