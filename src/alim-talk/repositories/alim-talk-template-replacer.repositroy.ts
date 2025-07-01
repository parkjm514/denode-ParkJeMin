import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AlimTalkTemplateReplacer } from "../entities/alim-talk-template-replacer.entity";

@Injectable()
export class AlimTalkTemplateReplacerRepositroy extends Repository<AlimTalkTemplateReplacer> {
  constructor(private dataSource: DataSource) {
    super(AlimTalkTemplateReplacer, dataSource.createEntityManager());
  }
}
