import { IsNumber } from 'class-validator';

export class SessionDto {
  @IsNumber()
  accountId: number;

  @IsNumber()
  accountHistoryId: number;
}
