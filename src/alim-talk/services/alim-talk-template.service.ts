import { AlimTalkTemplateRepository } from "./../repositories/alim-talk-template.repository";
import { FindAlimTalkTemplateDto } from "./../dtos/find-alim-talk-template.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AlimTalkTemplateService {
  constructor(private alimTalkTemplateRepository: AlimTalkTemplateRepository) {}

  async getAlimTalkTemplate(findAlimTalkTemplateDto: FindAlimTalkTemplateDto) {
    const alimTalkTeamplate =
      await this.alimTalkTemplateRepository.findAlimTalkTemplate(
        findAlimTalkTemplateDto
      );

    return alimTalkTeamplate;
  }
}
