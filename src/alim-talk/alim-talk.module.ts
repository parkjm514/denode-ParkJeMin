import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlimTalkLog } from "./entities/alim-talk-log.entity";
import { AlimTalkTemplateReplacer } from "./entities/alim-talk-template-replacer.entity";
import { AlimTalkTemplate } from "./entities/alim-talk-template.entity";
import { AlimTalkLogService } from "./services/alim-talk-log.service";
import { AlimTalkTemplateReplaceService } from "./services/alim-talk-template-replacers.service";
import { AlimTalkTemplateService } from "./services/alim-talk-template.service";
import { SendingAlimTalkService } from "./services/sending-alim-talk.service";
import { AlimTalkLogRepository } from "./repositories/alim-talk-log.repository";
import { AlimTalkTemplateRepository } from "./repositories/alim-talk-template.repository";
import { AlimTalkTemplateReplacerRepositroy } from "./repositories/alim-talk-template-replacer.repositroy";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AlimTalkLog,
      AlimTalkTemplateReplacer,
      AlimTalkTemplate,
    ]),
  ],
  controllers: [],
  providers: [
    AlimTalkLogService,
    AlimTalkTemplateReplaceService,
    AlimTalkTemplateService,
    SendingAlimTalkService,
    AlimTalkLogRepository,
    AlimTalkTemplateReplacerRepositroy,
    AlimTalkTemplateRepository,
  ],
  exports: [],
})
export class AlimTalkModule {}
