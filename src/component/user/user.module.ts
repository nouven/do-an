import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from 'src/entity/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
