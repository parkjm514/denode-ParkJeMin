import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, Length } from "class-validator";
import { Administrator } from "src/administrator/entities/administrator.entity";
import { CoreEntity } from "src/shared/entities/core.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({
  name: "AlimTalkLog",
})
export class AlimTalkLog extends CoreEntity {
  // @ManyToOne(() => Administrator, (administrator) => administrator.id, {
  //   nullable: true,
  // })
  // administratorId: number;

  @ApiProperty({
    example: "알림톡 제목 로그",
    description: "회원가입 안내",
    required: true,
  })
  @IsString()
  @Length(1, 9999)
  @Column({
    comment: "알림톡 제목 로그",
    type: "varchar",
    length: 9999,
    nullable: true,
  })
  alimTalkTitleLog: string;

  @ApiProperty({
    example: "알림톡 내용 로그",
    description: "홍길동님이 회원가입 완료되었습니다.",
    required: true,
  })
  @IsString()
  @Column({
    comment: "알림톡 내용 로그",
    type: "text",
    nullable: true,
  })
  alimTalkContentLog: string;

  @ApiProperty({
    example: true,
    description: "알림톡 전송 성공 여부",
    required: true,
  })
  @IsBoolean()
  @Column({
    comment: "알림톡 전송 성공 여부",
    type: "boolean",
    nullable: true,
  })
  isSendingSuccess: boolean;

  @ApiProperty({
    example: "1234",
    description: "알림톡 코드",
    required: true,
  })
  @IsString()
  @Length(1, 100)
  @Column({
    comment: "알림톡 템플릿 코드",
    type: "varchar",
    length: 100,
    nullable: false,
  })
  alimTalkTemplateCode: string;
}
