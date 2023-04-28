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
import { ResponsePayload } from 'src/utils/response-payload';

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

  async upload(req: FileDto): Promise<any> {
    const file = req;
    const metaData: ItemBucketMetadata = { MimeType: file.mimetype };
    const minioRes: ResponsePayload<any> = await new Promise(
      (resolve, reject) => {
        this.minioClient.putObject(
          this.bucketName,
          file.filename,
          file.data,
          file.data.length,
          metaData,
          (err, objInfo) => {
            if (err) {
              reject({
                data: err,
                statusCode: ResponseCodeEnum.BAD_REQUEST,
              } as ResponsePayload<any>);
            }
            resolve({
              data: objInfo,
              statusCode: ResponseCodeEnum.SUCCESS,
            } as ResponsePayload<any>);
          },
        );
      },
    );
    return minioRes;
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName);
    }
  }

  public async removeObject(fileName: string): Promise<any> {
    const minioRes = new Promise((resolve, reject) => {
      this.minioClient.removeObject(this.bucketName, fileName, function(err) {
        if (err) {
          reject({
            data: err,
            statusCode: ResponseCodeEnum.BAD_REQUEST,
          } as ResponsePayload<any>);
        }
        resolve({
          statusCode: ResponseCodeEnum.SUCCESS,
        } as ResponsePayload<any>);
      });
    });
    return minioRes;
  }

  async getFileUrl(fileName: string) {
    const minioRes = await new Promise((resolve, reject) => {
      this.minioClient.presignedUrl(
        'GET',
        this.bucketName,
        fileName,
        function(err, presignedUrl) {
          if (err) {
            reject({
              data: err,
              statusCode: ResponseCodeEnum.BAD_REQUEST,
            } as ResponsePayload<any>);
          }

          resolve({
            data: { url: presignedUrl },
            statusCode: ResponseCodeEnum.SUCCESS,
          } as ResponsePayload<any>);
        },
      );
    });
    return minioRes;
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS);
  }

  public async getObject(fileName: string): Promise<any> {
    const minioRes = await new Promise((resolve, reject) => {
      let size = 0;
      let data;
      this.minioClient.getObject(
        this.bucketName,
        fileName,
        function(err, dataStream) {
          if (err) {
            return console.log(err);
          }
          dataStream.on('data', function(chunk) {
            size += chunk.length;
            data += chunk;
          });
          dataStream.on('end', function() {
            resolve({ size, data });
          });
          dataStream.on('error', function(err) {
            reject('error');
          });
        },
      );
    });

    return minioRes;
  }

  async getList(): Promise<any> {
    const minioRes = await new Promise((resolve, reject) => {
      const data: any = [];
      const objectsStream = this.minioClient.listObjects(this.bucketName, '');
      objectsStream.on('data', function(obj) {
        data.push(obj);
      });

      objectsStream.on('error', function(err) {
        resolve({
          data: err,
          statusCode: ResponseCodeEnum.BAD_REQUEST,
        } as ResponsePayload<any>);
      });

      objectsStream.on('end', function() {
        resolve({
          data,
          statusCode: ResponseCodeEnum.BAD_REQUEST,
        } as ResponsePayload<any>);
      });
    });

    return minioRes;
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
