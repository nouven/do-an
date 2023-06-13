import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/entity/file/file.entity';
import { FileRepository } from 'src/repository/file.repository';
import { MinioStorageModule } from '../minio-storage/minio-storage.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), MinioStorageModule],
  exports: [
    {
      provide: 'FileServiceInterface',
      useClass: FileService,
    },
  ],
  controllers: [FileController],
  providers: [
    {
      provide: 'FileServiceInterface',
      useClass: FileService,
    },
    {
      provide: 'FileRepositoryInterface',
      useClass: FileRepository,
    },
  ],
})
export class FileModule {}
