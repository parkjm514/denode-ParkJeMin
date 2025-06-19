import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Account } from 'src/account/entities/account.entity';
import { CoreEntity } from 'src/shared/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({
  name: 'Administrator',
})
export class Administrator extends CoreEntity {
  @ApiProperty({
    description: '계정',
    required: true,
  })
  @JoinColumn({ name: 'accountId' })
  @OneToOne(() => Account, {
    nullable: false,
    eager: false,
  })
  account: Account;

  @ApiProperty({
    description: '관리자명',
    required: true,
    example: '홍길동',
  })
  @IsString()
  @Length(1, 200)
  @Column({
    comment: '관리자 명',
    type: 'varchar',
    nullable: false,
    length: 200,
    select: true,
  })
  administratorName: string;
}
