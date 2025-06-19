import { FindAccountDto } from '../dtos/find-account.dto';
import { EntityManager } from 'typeorm';
import { GenerateAccountDto } from '../dtos/generate-account.dto';
import { AccountRepository } from '../repositories/account.repositories';
import { Injectable } from '@nestjs/common';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  async generateAccount(
    generateAccountDto: GenerateAccountDto,
    transactionManager?: EntityManager,
  ): Promise<Account> {
    return await this.accountRepository.createAccount(
      generateAccountDto,
      transactionManager,
    );
  }

  async getAccount(
    findAccountDto: FindAccountDto,
    transactionManager?: EntityManager,
  ) {
    return await this.accountRepository.findAccount(
      findAccountDto,
      transactionManager,
    );
  }
}
