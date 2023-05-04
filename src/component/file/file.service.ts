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
import { SEPR_CHAR } from 'src/constant';
import fs from 'fs';

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
      mimetype: file.mimetype,
      createdBy: req.user?.id,
    });
    await this.fileRepository.create(fileEntity);

    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }

  public async update(file: FileDto, fileEntity): Promise<any> {
    const minioRes: ResponsePayload<any> =
      await this.minioStorageService.upload(file);
    if (minioRes.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(minioRes.statusCode)
        .withMessage(ErrorMessageEnum.UPLOAD_FAILED);
    }
    try {
      await this.fileRepository.create(fileEntity);
    } catch (error) { }
    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS);
  }

  public async getDetail(id: number): Promise<any> {
    const file = await this.fileRepository.getDetail(id);
    const { size, data } = await this.minioStorageService.getObject(file.name);
    const resData = plainToInstance(
      GetFileDetailResDto,
      { ...file, size },
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(resData)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getObject(fileName: string): Promise<any> {
    return await this.minioStorageService.getObject(fileName);
  }

  public async getList(req: GetFileListReqDto): Promise<any> {
    const { data, count } = await this.fileRepository.getList(req);

    const resData = plainToInstance(GetFileListResDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder({ items: resData, count })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async delete(id: number): Promise<any> {
    console.log('<============>   ', id);
    return id;

    const data = await this.fileRepository.findOneById(id);
    if (isEmpty(data)) {
      return new ResponseBuilder().withCode(ResponseCodeEnum.NOT_FOUND).build();
    }

    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();

    try {
      const minioRes: ResponsePayload<any> =
        await this.minioStorageService.removeObject(data.name);
      if (minioRes.statusCode !== ResponseCodeEnum.SUCCESS) {
        throw new Error();
      }
      await this.fileRepository.remove(id);
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .build();
    }
  }

  public async getFileUrl(id: number): Promise<any> {
    const data = await this.fileRepository.findOneById(id);
    if (isEmpty(data)) {
      return new ResponseBuilder().withCode(ResponseCodeEnum.NOT_FOUND).build();
    }
    const minioRes = await this.minioStorageService.getFileUrl(data.name);
    return minioRes;
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

  public async readSignature(uint8: Uint8Array): Promise<any> {
    const buffer = Buffer.from(uint8);
    const pdfExtract = new PDFExtract();
    const options = {}; /* see below */
    const content = await new Promise((resolve) => {
      pdfExtract.extractBuffer(buffer, options, (err, data) => {
        if (err) return console.log(err);
        const pages = data.pages;
        const latestPage = pages[pages.length - 1];
        const content = latestPage.content.map((i) => i.str);
        resolve(content.join(''));
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
    const fontSize = 14;
    let result = '';
    for (let i = 0; i < signature.length; i += 45) {
      const temp = signature.slice(i, i + 45);
      result = result.concat(`${temp}\n`);
    }
    page.drawText(result, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
    });

    const date = pdfDoc.getModificationDate();
    console.log('<============>   date: ', date);
    pdfDoc.setModificationDate(date);
    let pdfBytes = await pdfDoc.save();

    return Buffer.from(pdfBytes);
  }

  public async removeLatestPage(buffer: Buffer) {
    const existingPdfBytes = buffer;
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    pdfDoc.removePage(pages.length - 1);

    const date = pdfDoc.getModificationDate();
    console.log('<============>   date: ', date);
    pdfDoc.setModificationDate(date);
    const pdfBytes = await pdfDoc.save();

    const fileDto = new FileDto();
    fileDto.data = Buffer.from(pdfBytes);
    fileDto.filename = 'test-verify.pdf';
    fileDto.mimetype = 'application/pdf';
    this.minioStorageService.upload(fileDto);

    return Buffer.from(pdfBytes);
  }
}
