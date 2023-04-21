import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyEntity } from 'src/entity/key.entity';
import { KeyRepository } from 'src/repository/key.repository';
import { KeyServiceInterface } from './interface/key.service.interface';
import { KeyController } from './key.controller';
import { KeyService } from './key.service';

@Module({
  imports: [TypeOrmModule.forFeature([KeyEntity])],
  exports: [
    {
      provide: 'KeyServiceInterface',
      useClass: KeyService,
    },
  ],
  providers: [
    {
      provide: 'KeyServiceInterface',
      useClass: KeyService,
    },
    {
      provide: 'KeyRepositoryInterface',
      useClass: KeyRepository,
    },
  ],
  controllers: [KeyController],
})
export class KeyModule { }
