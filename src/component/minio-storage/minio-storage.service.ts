import { Injectable } from '@nestjs/common';
import minioStorageConfig from 'src/config/minio-storage.config';
import { MinioStorageServiceInterface } from './interface/minio-storage.service.interface';
import { Client } from 'minio';
import {
  FileDto,
  UploadFileReqDto,
} from '../file/dto/request/upload-file.req.dto';
import { resolve } from 'path';
import { reject } from 'lodash';

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
  }

  async uplaod(req: UploadFileReqDto): Promise<any> {
    return;
  }

  async getFileUrl(fileName: string) {
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
    );
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }

  async getList(): Promise<any> {
    const x = await new Promise((resolve, reject) => {
      const data: any = [];
      const objectsStream = this.minioClient.listObjects(this.bucketName);

      objectsStream.on('data', function(obj) {
        data.push(obj);
      });
      objectsStream.on('end', function() {
        resolve(data);
      });
    });
  }
}
