import { StorageFile } from './storage-file';
import { DownloadResponse, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import storageConfig from 'src/config/storage.config';
import { StorageServiceInterface } from './interface/storage.service.interface';
import { FileDto } from '../file/dto/request/upload-file.req.dto';

@Injectable()
export class StorageService implements StorageServiceInterface {
  private storage: Storage;
  private bucket: string;

  constructor() {
    //this.storage = new Storage({
    //  projectId: storageConfig.projectId,
    //  credentials: {
    //    client_email: storageConfig.clientEmail,
    //    private_key: storageConfig.privateKey,
    //  },
    //});
    //this.bucket = storageConfig.bucket;
  }

  async save(
    //path?: string,
    //contentType?: string,
    //media?: Buffer,
    //metadata?: { [key: string]: string }[],
    req: FileDto,
  ) {
    //const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});
    //const file = this.storage.bucket(this.bucket).file(path);
    //const stream = file.createWriteStream();
    //stream.on('finish', async () => {
    //  return await file.setMetadata({
    //    metadata: object,
    //  });
    //});
    //stream.end(media);
  }

  async delete(path: string) {
    await this.storage
      .bucket(this.bucket)
      .file(path)
      .delete({ ignoreNotFound: true });
  }

  async get(path: string): Promise<any> {
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;
    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>();
    return storageFile;
  }

  async getList(): Promise<any> {
    const [files] = await this.storage.bucket(this.bucket).getFiles();

    return files.map((i) => i.metadata);
  }

  async getWithMetaData(path: string): Promise<StorageFile> {
    const [metadata] = await this.storage
      .bucket(this.bucket)
      .file(path)
      .getMetadata();
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;

    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>(
      Object.entries(metadata || {}),
    );
    storageFile.contentType = storageFile.metadata.get('contentType');
    return storageFile;
  }
}
