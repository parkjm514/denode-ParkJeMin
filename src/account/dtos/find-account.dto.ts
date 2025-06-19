import { PickType, PartialType } from '@nestjs/swagger';
import { Account } from '../entities/account.entity';

export class FindAccountDto extends PartialType(
  PickType(Account, ['accountEmail', 'id']),
) {}
