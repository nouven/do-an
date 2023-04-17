import { Module } from '@nestjs/common';
import { MinioStorageService } from './minio-storage.service';

@Module({
  imports: [],
  exports: [
    {
      provide: 'MinioStorageServiceInterface',
      useClass: MinioStorageService,
    },
  ],
  providers: [
    {
      provide: 'MinioStorageServiceInterface',
      useClass: MinioStorageService,
    },
  ],
})
export class MinioStorageModule { }
