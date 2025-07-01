import { PickType } from "@nestjs/swagger";
import { AlimTalkTemplate } from "../entities/alim-talk-template.entity";

export class FindAlimTalkTemplateDto extends PickType(AlimTalkTemplate, [
  "alimTalkTemplateCode",
]) {}
