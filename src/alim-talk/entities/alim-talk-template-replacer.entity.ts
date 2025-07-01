import { CoreEntity } from "src/shared/entities/core.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { AlimTalkTemplate } from "./alim-talk-template.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

@Entity({
  name: "AlimTalkTemplateReplacer",
})
export class AlimTalkTemplateReplacer extends CoreEntity {
  @ManyToOne(
    () => AlimTalkTemplate,
    (alimTalkTemplate) => alimTalkTemplate.alimTalkTemplateReplacers,
    {
      nullable: true,
      eager: false,
    }
  )
  alimTalkTemplate: AlimTalkTemplate;

  @ApiProperty({
    example: "{name}",
    description: "알림톡 템플릿 변환 키워드",
    required: true,
  })
  @IsString()
  @Length(1, 500)
  @Column({
    comment: "알림톡 템플릿 변환 키워드",
    type: "varchar",
    length: 500,
    nullable: false,
  })
  alimTalkTemplateReplacerKeyword: string;
}
