import { GenerateAdministratorDto } from '../dtos/generate-administrator.dto';
import { Administrator } from '../entities/administrator.entity';
import { FindAdministratorDto } from '../dtos/find-administrator.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { constants } from '../administrator.constants';

@Injectable()
export class AdministratorRepository extends Repository<Administrator> {
  constructor(private dataSource: DataSource) {
    super(Administrator, dataSource.createEntityManager());
  }

  async generateAdministrator(
    generateAdministratorDto: GenerateAdministratorDto,
    transactionManager?: EntityManager,
  ) {
    try {
      let result;

      const instance = this.create(generateAdministratorDto);

      if (transactionManager) {
        result = await transactionManager.save(Administrator, instance);
      } else {
        result = await this.save(instance);
      }
      return result;
    } catch (e) {
      switch (e.constraint) {
        default:
          throw e;
      }
    }
  }

  async findAdministrator(
    findAdministratorDto: FindAdministratorDto,
    transactionManager?: EntityManager,
  ): Promise<Administrator> {
    const query = this.buildQuery(findAdministratorDto, transactionManager);

    const result = await query.getOne();

    if (!result) {
      throw new NotFoundException({
        statusCode: 404,
        errorCode: constants.errorMessage.ADMINISTRATOR_NOT_FOUND,
      });
    }

    return result;
  }

  private buildQuery(
    findAdministratorDto: FindAdministratorDto,
    transactionManager?: EntityManager,
  ) {
    const { accountId, accountJoin, accountEmail, passwordLoadable } =
      findAdministratorDto;

    let query;

    if (transactionManager) {
      query = transactionManager.createQueryBuilder(Administrator, 'a');
    } else {
      query = this.createQueryBuilder('a');
    }

    if (accountJoin) {
      query.leftJoinAndSelect('a.account', 'account');
      if (accountId) {
        query.andWhere('account.id = :accountId', { accountId });
      }
      if (accountEmail) {
        query.andWhere('account.accountEmail = :accountEmail', {
          accountEmail,
        });
      }
      if (passwordLoadable) {
        query.addSelect('account.password');
      }
    }

    return query;
  }
}
