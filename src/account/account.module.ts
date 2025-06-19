import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountService } from './services/account.service';
import { AccountRepository } from './repositories/account.repositories';
import { AccountHistoryService } from './services/account-history.service';
import { AccountHistoryRepository } from './repositories/account-history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [],
  providers: [
    AccountService,
    AccountRepository,
    AccountHistoryService,
    AccountHistoryRepository,
  ],
  exports: [AccountService, AccountHistoryService],
})
export class AccountModule {}
