import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extend, isEmpty } from 'lodash';
import { GetFileListReqDto } from 'src/component/file/dto/request/get-file-list.req.dto';
import { FileRepositoryInterface } from 'src/component/file/interface/file.repository.interface';
import { BaseAbstractRepository } from 'src/core/repository/base.abstract.repository';
import { FileEntity } from 'src/entity/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileRepository
  extends BaseAbstractRepository<FileEntity>
  implements FileRepositoryInterface {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {
    super(fileRepository);
  }

  createEntity(data: any, entity?: FileEntity): FileEntity {
    const fileEntity = new FileEntity();
    fileEntity.createdBy = data.createdBy;
    fileEntity.keyId = data.keyId;
    fileEntity.name = data.name;
    fileEntity.mimetype = data.mimetype;
    fileEntity.isSigned = data.isSigned;
    fileEntity.isShared = data.isShared;

    return fileEntity;
  }

  async getDetail(id: number): Promise<any> {
    const query = this.fileRepository
      .createQueryBuilder('f')
      .select([
        'f.id as "id"',
        'f.name as "name"',
        'f.created_at as "createdAt"',
        'f.updated_at as "updatedAt"',
        `CASE WHEN count(u) = 0 THEN '{}'
          ELSE JSON_BUILD_OBJECT(
            'id', u.id,
            'name', u.name,
            'email', u.email
          )END as "user"`,
      ])
      .innerJoin('users', 'u', 'f.created_by = u.id')
      .where('f.id = :id', { id })
      .groupBy('f.id')
      .addGroupBy('u.id')
      .addOrderBy('f.id', 'DESC');

    return await query.getRawOne();
  }

  async getList(req: GetFileListReqDto): Promise<any> {
    const { filter, take, skip, user } = req;

    const query = this.fileRepository
      .createQueryBuilder('f')
      .select([
        'f.id as "id"',
        'f.name as "name"',
        'f.is_shared as "isShared"',
        'f.created_at as "createdAt"',
        'f.updated_at as "updatedAt"',
        `CASE WHEN count(u) = 0 THEN '{}'
          ELSE JSON_BUILD_OBJECT(
            'id', u.id,
            'name', u.name,
            'email', u.email
          )END as "user"`,
      ])
      .innerJoin('users', 'u', 'f.created_by = u.id')
      .groupBy('f.id')
      .addGroupBy('u.id')
      .addOrderBy('f.id', 'DESC');
    if (!isEmpty(filter)) {
      filter.forEach((i) => {
        switch (i.column) {
          case 'name':
            query.where('f.name ILIKE :name', { name: `%${i.text}%` });
            break;
          case 'isShared':
            const isShared = i.text === 'true';
            if (!isShared) {
              query.andWhere('u.id = :id', {
                id: user?.id,
              });
            } else {
              query.andWhere('f.is_shared = :isShared', {
                isShared: i.text === 'true',
              });
            }
            break;
          default:
            break;
        }
      });
    }

    const data = await query.limit(take).offset(skip).getRawMany();
    const count = await query.getCount();
    return { data, count };
  }

  public async getLatestId() {
    return await this.fileRepository
      .createQueryBuilder('f')
      .select(['max(f.id) AS "id"'])
      .getRawOne();
  }
}
