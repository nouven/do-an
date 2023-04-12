import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';

@Module({
  imports: [],
  exports: [
    {
      provide: 'StorageServiceInterface',
      useClass: StorageService,
    },
  ],
  providers: [
    {
      provide: 'StorageServiceInterface',
      useClass: StorageService,
    },
  ],
})
export class StorageModule { }
