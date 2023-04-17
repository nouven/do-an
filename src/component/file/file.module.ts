import { Module } from '@nestjs/common';
import { MinioStorageModule } from '../minio-storage/minio-storage.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [MinioStorageModule],
  exports: [],
  controllers: [FileController],
  providers: [
    {
      provide: 'FileServiceInterface',
      useClass: FileService,
    },
  ],
})
export class FileModule { }
