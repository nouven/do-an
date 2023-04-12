import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [StorageModule],
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
