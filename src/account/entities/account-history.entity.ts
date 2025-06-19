import { CoreEntity } from 'src/shared/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Account } from './account.entity';
import { IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@Entity({
  name: 'AccountHistory',
})
export class AccountHistory extends CoreEntity {
  @ManyToOne(() => Account, (account) => account.accountHistories, {
    nullable: false,
    cascade: false,
  })
  @IsNotEmpty()
  account: Account;

  @ApiProperty({
    example: '2030-01-01T00:00:00.000z',
    description: '세션 만료 일시',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: false, type: 'timestamp' })
  expiredAt: Date;
}
