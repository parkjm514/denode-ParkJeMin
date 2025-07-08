import { AlimTalkTemplateReplacer } from "../entities/alim-talk-template-replacer.entity";

export class ReplaceAlimTalkDto {
  alimTalkContent: string;

  alimTalkTemplateReplacerKeyword: string;

  replaceingWord: string;
}
