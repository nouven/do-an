
import { BaseInterfaceRepository } from 'src/core/repository/base.interface.repository';
import { UserEntity } from 'src/entity/user/user.entity';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {
  getLatestId(): any;
}
