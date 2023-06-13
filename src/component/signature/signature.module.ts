import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/entity/file/file.entity';
import { KeyEntity } from 'src/entity/key/key.entity';
import { UserEntity } from 'src/entity/user/user.entity';
import { FileRepository } from 'src/repository/file.repository';
import { KeyRepository } from 'src/repository/key.repository';
import { UserRepository } from 'src/repository/user.repository';
import { FileModule } from '../file/file.module';
import { TimeLogModule } from '../time-log/time-log.module';
import { SignatureController } from './signature.controller';
import { SignatureService } from './signature.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FileEntity, KeyEntity]),
    FileModule,
    TimeLogModule,
  ],
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
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'KeyRepositoryInterface',
      useClass: KeyRepository,
    },
  ],
})
export class SignatureModule {}
