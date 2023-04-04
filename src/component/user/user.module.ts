import { Module } from '@nestjs/common';
import { UserController } from './user.controler';
import { UserService } from './user.service';

@Module({
  imports: [],
  exports: [],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
})
export class UserModule { }
