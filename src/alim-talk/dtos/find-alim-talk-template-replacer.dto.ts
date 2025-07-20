import { PickType } from "@nestjs/swagger";
import { AlimTalkTemplateReplacer } from "../entities/alim-talk-template-replacer.entity";

export class FindAlimTalkTemplateReplacerDto extends PickType(
  AlimTalkTemplateReplacer,
  ["alimTalkTemplateReplacerKeyword"]
) {
  alimTalkTemplateId: number;
}
