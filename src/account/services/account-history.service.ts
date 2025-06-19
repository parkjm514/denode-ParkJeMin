import { FindAccountHistoryDto } from '../dtos/find-account-history.dto';
import { EntityManager } from 'typeorm';
import { GenerateAccountHistoryDto } from '../dtos/generate-account-history.dto';
import { AccountHistoryRepository } from '../repositories/account-history.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountHistoryService {
  constructor(private accountHistoryRepository: AccountHistoryRepository) {}

  async generateAccountHistory(
    generateAccountHistoryDto: GenerateAccountHistoryDto,
    transactionManager?: EntityManager,
  ) {
    const result = await this.accountHistoryRepository.createAccountHistory(
      generateAccountHistoryDto,
      transactionManager,
    );

    return result;
  }

  async getAccountHistoriyListAndCount(
    findAccountHistoryDto: FindAccountHistoryDto,
    transactionManager?: EntityManager,
  ) {
    return await this.accountHistoryRepository.findAccountHistoryListAndCount(
      findAccountHistoryDto,
      transactionManager,
    );
  }

  async getAccountHistory(
    findAccountHistoryDto: FindAccountHistoryDto,
    transactionManager?: EntityManager,
  ) {
    return await this.accountHistoryRepository.findAccountHistory(
      findAccountHistoryDto,
      transactionManager,
    );
  }

  async removeAccountHistoryByAccountId(
    accountId: number,
    transactionManager?: EntityManager,
  ) {
    await this.accountHistoryRepository.deleteAccountHistoryByAccountId(
      accountId,
      transactionManager,
    );
  }
}
