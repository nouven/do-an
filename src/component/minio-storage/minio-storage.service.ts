import { Injectable } from '@nestjs/common';
import minioStorageConfig from 'src/config/minio-storage.config';
import { MinioStorageServiceInterface } from './interface/minio-storage.service.interface';
import { Client, ItemBucketMetadata } from 'minio';
import {
  FileDto,
  UploadFileReqDto,
} from '../file/dto/request/upload-file.req.dto';
import { resolve } from 'path';
import { reject } from 'lodash';
import { ResponseBuilder } from 'src/utils/response-builder';
import { ResponseCodeEnum } from 'src/constant/response-code.enum';
import { GetFileURLReqDto } from '../file/dto/request/get-file-url.req.dto';

@Injectable()
export class MinioStorageService implements MinioStorageServiceInterface {
  private minioClient: Client;
  private bucketName: string;
  constructor() {
    this.minioClient = new Client({
      endPoint: minioStorageConfig.minioHost,
      port: minioStorageConfig.minioPort,
      useSSL: minioStorageConfig.useSSL === 'true',
      accessKey: minioStorageConfig.minioAccessKey,
      secretKey: minioStorageConfig.minioSecretKey,
    });
    this.bucketName = minioStorageConfig.minioBucketName;
    this.createBucketIfNotExists();
  }

  async uplaod(req: UploadFileReqDto): Promise<any> {
    const file = req.files[0] as FileDto;
    const metaData: ItemBucketMetadata = { MimeType: file.mimetype };
    const data = await this.minioClient.putObject(
      this.bucketName,
      file.filename,
      file.data,
      metaData,
    );
    return new ResponseBuilder(data).withCode(ResponseCodeEnum.SUCCESS);
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName);
    }
  }

  async getFileUrl(req: GetFileURLReqDto) {
    const { fileName } = req;
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
    );
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS);
  }

  async getList(): Promise<any> {
    const data = await new Promise((resolve, reject) => {
      const data: any = [];
      const objectsStream = this.minioClient.listObjects(this.bucketName);

      objectsStream.on('data', function(obj) {
        data.push(obj);
      });
      objectsStream.on('end', function() {
        resolve(data);
      });
    });
    return new ResponseBuilder(data).withCode(ResponseCodeEnum.SUCCESS);
  }

  async fGetObject(): Promise<any> {
    const data = await new Promise((resolve, reject) => {
      const data: any = [];
      const objectsStream = this.minioClient.listIncompleteUploads(
        this.bucketName,
      );

      objectsStream.on('data', function(obj) {
        data.push(obj);
      });
      objectsStream.on('end', function() {
        resolve(data);
      });
    });
    return new ResponseBuilder(data).withCode(ResponseCodeEnum.SUCCESS);
  }
}
