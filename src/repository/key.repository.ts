import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KeyRepositoryInterface } from 'src/component/key/interface/key.repository.interface';
import { BaseAbstractRepository } from 'src/core/repository/base.abstract.repository';
import { KeyEntity } from 'src/entity/key/key.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KeyRepository
  extends BaseAbstractRepository<KeyEntity>
  implements KeyRepositoryInterface
{
  constructor(
    @InjectRepository(KeyEntity)
    private readonly keyRepository: Repository<KeyEntity>,
  ) {
    super(keyRepository);
  }

  createEntity(data: any, entity?: KeyEntity): KeyEntity {
    const keyEntity = new KeyEntity();
    keyEntity.code = data.code;
    keyEntity.priv = data.priv;
    keyEntity.publ = data.publ;
    keyEntity.type = data.type;
    keyEntity.createdBy = data.createdBy;
    return keyEntity;
  }

  public async getKeyByUserId(userId: number): Promise<any> {
    return await this.keyRepository
      .createQueryBuilder('k')
      .select(['k.id AS "id"', 'k.publ as "publ"'])
      .where('k.created_by = :userId', { userId })
      .orderBy('k.id', 'DESC')
      .getRawOne();
  }

  public async getLatestId() {
    return await this.keyRepository
      .createQueryBuilder('k')
      .select(['max(k.id) AS "id"'])
      .getRawOne();
  }
}
