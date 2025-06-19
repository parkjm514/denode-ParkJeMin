import { FindAccountHistoryDto } from '../dtos/find-account-history.dto';
import { GenerateAccountHistoryDto } from '../dtos/generate-account-history.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { AccountHistory } from '../entities/account-history.entity';
import { constants } from '../account.constants';

@Injectable()
export class AccountHistoryRepository extends Repository<AccountHistory> {
  constructor(private dataSource: DataSource) {
    super(AccountHistory, dataSource.createEntityManager());
  }
  async createAccountHistory(
    generateAccountHistoryDto: GenerateAccountHistoryDto,
    transactionManager?: EntityManager,
  ) {
    try {
      let result;
      const instance = generateAccountHistoryDto;
      if (transactionManager) {
        result = await transactionManager.save(AccountHistory, instance);
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

  async findAccountHistoryListAndCount(
    findAccountHistoryDto: FindAccountHistoryDto,
    transactionManager?: EntityManager,
  ) {
    const query = this.buildQuery(findAccountHistoryDto, transactionManager);
    const result = await query.getManyAndCount();

    if (!result || result[0].length === 0) {
      throw new NotFoundException({
        statusCode: 404,
        errorCode: constants.errorMessage.ACCOUNT_HISTORY_NOT_FOUND,
      });
    }
    return { list: result[0], count: result[1] };
  }

  async findAccountHistory(
    findAccountHistoryDto: FindAccountHistoryDto,
    transactionManager?: EntityManager,
  ): Promise<AccountHistory> {
    const query = this.buildQuery(findAccountHistoryDto, transactionManager);
    const result = await query.getOne();

    if (!result) {
      throw new NotFoundException({
        statusCode: 404,
        errorCode: constants.errorMessage.ACCOUNT_HISTORY_NOT_FOUND,
      });
    }
    return result;
  }

  async deleteAccountHistoryByAccountId(
    accountId: number,
    transactionManager?: EntityManager,
  ) {
    if (transactionManager) {
      await transactionManager.softDelete(AccountHistory, {
        account: { id: accountId },
      });
    } else {
      await this.softDelete({ account: { id: accountId } });
    }
  }

  private buildQuery(
    findAccountHistoryDto: FindAccountHistoryDto,
    transactionManager?: EntityManager,
  ) {
    const { accountId, accountHistoryId } = findAccountHistoryDto;

    let query;

    if (transactionManager) {
      query = transactionManager.createQueryBuilder(AccountHistory, 'ah');
    } else {
      query = this.createQueryBuilder('ah');
    }
    if (accountHistoryId) {
      query.andWhere('ah.id = :accountHistoryId', { accountHistoryId });
    }
    if (accountId) {
      query.leftJoinAndSelect('ah.account', 'account');
      query.andWhere('account.id = :accountId', { accountId });
    }

    return query;
  }
}
