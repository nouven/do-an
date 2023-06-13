import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './component/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { ValidationPipe } from './core/pipe/validation.pipe';
import { APP_PIPE } from '@nestjs/core';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './component/auth/auth.module';
import { FileModule } from './component/file/file.module';
import { FirebaseModule } from 'nestjs-firebase';
import { MinioStorageModule } from './component/minio-storage/minio-storage.module';
import { KeyModule } from './component/key/key.module';
import { SignatureModule } from './component/signature/signature.module';
import { TimeLogModule } from './component/time-log/time-log.module';
import connectionOptions from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(connectionOptions.options),
    UserModule,
    AuthModule,
    FileModule,
    MinioStorageModule,
    KeyModule,
    SignatureModule,
    TimeLogModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AppService,
  ],
})
export class AppModule {}
