import { UserEntity } from 'src/entity/user.entity';
import { BaseInterfaceRepository } from 'src/core/repository/base.interface.repository';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {
  getLatestId(): any;
}
