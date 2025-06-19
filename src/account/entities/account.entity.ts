import { CoreEntity } from 'src/shared/entities/core.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { AccountHistory } from './account-history.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'Account',
})
@Unique('UNIQUE_ACCOUNT_EMAIL', ['accountEmail'])
export class Account extends CoreEntity {
  @OneToMany(() => AccountHistory, (accountHistory) => accountHistory.account, {
    nullable: true,
    eager: false,
    cascade: true,
  })
  accountHistories: AccountHistory;

  @ApiProperty({
    description: '계정 이메일',
    example: 'test1234@gmail.com',
    required: true,
  })
  @IsString()
  @Length(5, 50)
  @Column({
    comment: '계정 이메일',
    type: 'varchar',
    nullable: false,
    length: 50,
  })
  accountEmail: string;

  @ApiProperty({
    description: '계정 비밀번호 hash 값',
    example: 'asdf1234',
    required: true,
  })
  @IsString()
  @Length(1, 200)
  @Column({
    comment: '계정 비밀번호 hash 값',
    type: 'varchar',
    nullable: false,
    length: 200,
    select: false,
  })
  @Exclude()
  password: string;
}
