import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, Matches } from "class-validator";
import { Account } from "src/account/entities/account.entity";
import { CoreEntity } from "src/shared/entities/core.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { constants } from "../administrator.constants";

@Entity({
  name: "Administrator",
})
export class Administrator extends CoreEntity {
  @ApiProperty({
    description: "계정",
    required: true,
  })
  @JoinColumn({ name: "accountId" })
  @OneToOne(() => Account, {
    nullable: false,
    eager: false,
  })
  account: Account;

  @ApiProperty({
    description: "관리자명",
    required: true,
    example: "홍길동",
  })
  @IsString()
  @Length(1, 200)
  @Column({
    comment: "관리자 명",
    type: "varchar",
    nullable: false,
    length: 200,
    select: true,
  })
  administratorName: string;

  @ApiProperty({
    description: "핸드폰 번호",
    required: true,
    example: "01012341234",
  })
  @Matches(
    "/^01[0|1|6|7|8|9]\d{3,4}\d{4}$/",
    constants.errorMessage.IS_NOT_MATCH_PHONE_NUMBER.errorCode
  )
  @Column({
    comment: "핸드폰 번호",
    type: "varchar",
    nullable: false,
    length: 100,
  })
  phone: string;
}
