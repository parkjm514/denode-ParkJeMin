import { PickType } from '@nestjs/swagger';
import { AccountHistory } from '../entities/account-history.entity';
import { Account } from '../entities/account.entity';

export class GenerateAccountHistoryDto extends PickType(AccountHistory, [
  'expiredAt',
]) {
  account: Account;
}
