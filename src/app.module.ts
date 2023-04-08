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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
