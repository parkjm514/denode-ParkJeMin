import { PickType } from '@nestjs/swagger';
import { Account } from '../entities/account.entity';

export class GenerateAccountDto extends PickType(Account, [
  'accountEmail',
  'password',
]) {}
