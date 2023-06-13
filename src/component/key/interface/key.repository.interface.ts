import { BaseInterfaceRepository } from 'src/core/repository/base.interface.repository';
import { KeyEntity } from 'src/entity/key/key.entity';

export interface KeyRepositoryInterface
  extends BaseInterfaceRepository<KeyEntity> {
  getLatestId(): Promise<any>;
  createEntity(req): KeyEntity;
  getKeyByUserId(userId: number): Promise<any>;
}
