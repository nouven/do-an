import { Inject, Injectable } from '@nestjs/common';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { ResponseBuilder } from 'src/utils/response-builder';
import { FileDto, UploadFileReqDto } from './dto/request/upload-file.req.dto';
import { FileServiceInterface } from './interface/file.service.interface';
import { MinioStorageServiceInterface } from '../minio-storage/interface/minio-storage.service.interface';
import { GetFileURLReqDto } from './dto/request/get-file-url.req.dto';
import { isEmpty } from 'lodash';
import { ResponsePayload } from 'src/utils/response-payload';
import { ErrorMessageEnum } from 'src/constant/error-message.enum';
import { FileRepositoryInterface } from './interface/file.repository.interface';
import { GetFileListReqDto } from './dto/request/get-file-list.req.dto';
import { plainToInstance } from 'class-transformer';
import { GetFileListResDto } from './dto/response/get-file-list.res.dto';
import { GetFileDetailResDto } from './dto/response/get-file-detail.res.dto';
import { PDFExtract } from 'pdf.js-extract';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable()
export class FileService implements FileServiceInterface {
  constructor(
    @Inject('FileRepositoryInterface')
    private readonly fileRepository: FileRepositoryInterface,

    @Inject('MinioStorageServiceInterface')
    private readonly minioStorageService: MinioStorageServiceInterface,
  ) { }

  public async upload(req: UploadFileReqDto): Promise<any> {
    const file: FileDto = req.files[0];
    file.filename = await this.generateFileName(file.filename);

    const minioRes: ResponsePayload<any> =
      await this.minioStorageService.upload(file);
    if (minioRes.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(minioRes.statusCode)
        .withMessage(ErrorMessageEnum.UPLOAD_FAILED);
    }

    const fileEntity = this.fileRepository.createEntity({
      name: file.filename,
      createdBy: req.user?.id,
    });
    await this.fileRepository.create(fileEntity);

    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS);
  }

  public async getDetail(id: number): Promise<any> {
    const file = await this.fileRepository.getDetail(id);
    const size = await this.minioStorageService.getObject(file.name);
    const resData = plainToInstance(
      GetFileDetailResDto,
      { ...file, size },
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(resData).withCode(ResponseCodeEnum.SUCCESS);
  }

  public async getList(req: GetFileListReqDto): Promise<any> {
    const { data, count } = await this.fileRepository.getList(req);

    const resData = plainToInstance(GetFileListResDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder({ items: data, count }).withCode(
      ResponseCodeEnum.SUCCESS,
    );
  }

  public async getFileUrl(req: GetFileURLReqDto): Promise<any> {
    return this.minioStorageService.getFileUrl(req);
  }

  private async generateFileName(fileName: string): Promise<string> {
    const data = await this.fileRepository.getLatestId();
    let id = '1';
    if (data.id) {
      id = (data.id + 1).toString();
    }
    const name = `F.${id.padStart(4, '0')}.${fileName}`;
    return name;
  }

  public async readFromLatestPage(buffer: Buffer): Promise<any> {
    const pdfExtract = new PDFExtract();
    const options = {}; /* see below */
    const content = await new Promise((resolve) => {
      pdfExtract.extractBuffer(buffer, options, (err, data) => {
        if (err) return console.log(err);
        const pages = data.pages;
        const latestPage = pages[pages.length - 1];
        const content = latestPage.content.map((i) => i.str);
        resolve(content);
      });
    });
    return content;
  }

  public async write2LatestPage(signature: string, buffer: Buffer) {
    const existingPdfBytes = buffer;
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 30;
    page.drawText(signature, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71),
    });
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }

  public async removeLatestPage(buffer: Buffer) {
    const existingPdfBytes = buffer;
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    pdfDoc.removePage(pages.length - 1);
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
}
