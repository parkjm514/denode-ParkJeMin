import { AlimTalkTemplate } from "./../entities/alim-talk-template.entity";
import { AlimTalkTemplateService } from "./alim-talk-template.service";
import { FindAlimTalkTemplateDto } from "./../dtos/find-alim-talk-template.dto";
import { constants } from "../alim-talk.constants";
import { Injectable } from "@nestjs/common";
import { ReplaceAlimTalkDto } from "../dtos/replace-alim-talk.dto";
import { SignUpAdministratorAlimTalkDto } from "../dtos/sign-up-administrator-alim-talk.dto";
import { SendingAlimTalkDto } from "../dtos/sending-alim-talk.dto";
import { SendingAlimTalkService } from "./sending-alim-talk.service";

@Injectable()
export class AlimTalkService {
  constructor(
    private alimTalkTemplateService: AlimTalkTemplateService,
    private sendingAlimTalkService: SendingAlimTalkService
  ) {}

  async SignUpAdministratorAlimTalk(
    signUpAdministratorAlimTalkDto: SignUpAdministratorAlimTalkDto
  ) {
    const { name, phone } = signUpAdministratorAlimTalkDto;
    const SING_UP_ADMINISTRATOR = constants.props.SING_UP_ADMINISTRATOR;

    const findAlimTalkTemplateDto: FindAlimTalkTemplateDto = {
      alimTalkTemplateKeyWord: SING_UP_ADMINISTRATOR,
    };

    const alimTalkTemplate: AlimTalkTemplate =
      await this.alimTalkTemplateService.getAlimTalkTemplate(
        findAlimTalkTemplateDto
      );

    let { alimTalkTemplateReplacers, alimTalkContent } = alimTalkTemplate;

    for (const alimTalkTemplateReplae of alimTalkTemplateReplacers) {
      switch (alimTalkTemplateReplae.alimTalkTemplateReplacerKeyword) {
        case constants.props.NAME:
          const replaceAlimTalkDto = {
            alimTalkContent,
            alimTalkTemplateReplacerKeyword:
              alimTalkTemplateReplae.alimTalkTemplateReplacerKeyword,
            replaceingWord: name,
          };
          alimTalkContent = this.replaceAlimTalk(replaceAlimTalkDto);
      }
    }

    const sendingAlimTalkDto: SendingAlimTalkDto = {
      alimTalkTemplateCode: alimTalkTemplate.alimTalkTemplateCode,
      alimTalkTitle: alimTalkTemplate.alimTalkTitle,
      alimTalkContent,
      apiKey: process.env.ALIM_TALK_KEY,
      phone: phone,
    };

    await this.sendingAlimTalkService.sendAlimTalk(sendingAlimTalkDto);
  }

  private replaceAlimTalk(replaceAlimTalkDto: ReplaceAlimTalkDto) {
    const { alimTalkContent, alimTalkTemplateReplacerKeyword, replaceingWord } =
      replaceAlimTalkDto;

    alimTalkContent.replaceAll(alimTalkTemplateReplacerKeyword, replaceingWord);

    return alimTalkContent;
  }
}
