import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";
import { CoreEntity } from "src/shared/entities/core.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AlimTalkTemplateReplacer } from "./alim-talk-template-replacer.entity";

@Entity({
  name: "AlimTalkTemplate",
})
export class AlimTalkTemplate extends CoreEntity {
  @OneToMany(
    () => AlimTalkTemplateReplacer,
    (alimTalkTemplateReplacer) => alimTalkTemplateReplacer.alimTalkTemplate,
    {
      nullable: true,
      eager: false,
      cascade: true,
    }
  )
  alimTalkTemplateReplacers: AlimTalkTemplateReplacer;

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

  @ApiProperty({
    example: "회원가입 안내",
    description: "알림톡 제목",
    required: true,
  })
  @IsString()
  @Length(1, 500)
  @Column({
    comment: "알림톡 제목",
    type: "varchar",
    length: 500,
    nullable: false,
  })
  alimTalkTitle: string;

  @ApiProperty({
    example: "{name}님이 회원가입 완료되었습니다.",
    description: "알림톡 내용",
    required: true,
  })
  @IsString()
  @Length(1, 99999)
  @Column({
    comment: "알림톡 내용",
    type: "varchar",
    length: 99999,
    nullable: false,
  })
  alimTalkContent: string;
}
