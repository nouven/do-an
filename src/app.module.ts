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
import { StorageModule } from './component/storage/storage.module';
import { MinioStorageModule } from './component/minio-storage/minio-storage.module';
import { KeyModule } from './component/key/key.module';
import { SignatureModule } from './component/signature/signature.module';

//const firebaseConfig = {
//  apiKey: "AIzaSyAkztoAUoCU4MeDc1jRkVyl7vPRO3t6Tf0",
//  authDomain: "doan-89e3e.firebaseapp.com",
//  projectId: "doan-89e3e",
//  storageBucket: "doan-89e3e.appspot.com",
//  messagingSenderId: "426978642179",
//  appId: "1:426978642179:web:bbfc3127655524a1ac4136",
//  measurementId: "G-BX1833SD63"
//};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //FirebaseModule.forRoot({
    //  googleApplicationCredential: './config/firebase.json',
    //}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      //logging: process.env.NODE_ENV === 'development',
      entities: [path.join(__dirname, '/entity/**/*.entity.{ts,js}')],
      migrations: [path.join(__dirname, '/database/migrations/*.{ts,js}')],
      subscribers: ['dist/observers/subscribers/*.subscriber.{ts,js}'],

      // We are using migrations, synchronize should be set to false.
      synchronize: false,
      // Run migrations automatically,
      // you can disable this if you prefer running migration manually.
      //migrationsRun: !isDevMode(),
      //extra: {
      //  max: parseInt(process.env.DATABASE_MAX_POOL) || 20,
      //},
      namingStrategy: new SnakeNamingStrategy(),
    }),
    UserModule,
    AuthModule,
    FileModule,
    //StorageModule,
    MinioStorageModule,
    KeyModule,
    SignatureModule,
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
export class AppModule { }
