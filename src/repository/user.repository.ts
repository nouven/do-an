import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepositoryInterface } from 'src/component/user/interface/user.respository.interface';
import { BaseAbstractRepository } from 'src/core/repository/base.abstract.repository';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<UserEntity>
  implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  createEntity(data: any, entity?: UserEntity): UserEntity {
    const userEntity = new UserEntity();

    userEntity.username = data.username;
    userEntity.password = data.password;
    userEntity.name = data.name;
    userEntity.code = data.code;
    userEntity.email = data.email;
    userEntity.status = data.status;

    return userEntity;
  }
  public async getLatestId() {
    return await this.userRepository
      .createQueryBuilder('u')
      .select(['max(u.id) AS "id"'])
      .getRawOne();
  }
}
