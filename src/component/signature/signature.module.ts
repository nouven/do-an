import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/entity/file.entity';
import { UserEntity } from 'src/entity/user.entity';
import { FileRepository } from 'src/repository/file.repository';
import { FileModule } from '../file/file.module';
import { SignatureController } from './signature.controller';
import { SignatureService } from './signature.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FileEntity]), FileModule],
  exports: [],
  controllers: [SignatureController],
  providers: [
    {
      provide: 'SignatureServiceInterface',
      useClass: SignatureService,
    },
    {
      provide: 'FileRepositoryInterface',
      useClass: FileRepository,
    },
  ],
})
export class SignatureModule { }
