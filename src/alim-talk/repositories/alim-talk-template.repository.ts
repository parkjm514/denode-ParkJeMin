import { FindAlimTalkTemplateDto } from "./../dtos/find-alim-talk-template.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { AlimTalkTemplate } from "../entities/alim-talk-template.entity";
import { constants } from "../alim-talk.constants";

@Injectable()
export class AlimTalkTemplateRepository extends Repository<AlimTalkTemplate> {
  constructor(private dataSource: DataSource) {
    super(AlimTalkTemplate, dataSource.createEntityManager());
  }

  async findAlimTalkTemplate(
    findAlimTalkTemplateDto: FindAlimTalkTemplateDto,
    transactionManager?: EntityManager
  ) {
    const query = this.buildQuery(findAlimTalkTemplateDto, transactionManager);

    const result = await query.getOne();

    if (!result) {
      throw new NotFoundException({
        statusCode: 404,
        errorCode: constants.errormessages.ALIM_TALK_TEMPLATE_NOT_FOUND,
      });
    }

    return result;
  }

  private buildQuery(
    findAlimTalkTemplateDto: FindAlimTalkTemplateDto,
    transactionManager?: EntityManager
  ) {
    const { alimTalkTemplateCode } = findAlimTalkTemplateDto;

    let query;

    if (transactionManager) {
      query = transactionManager.createQueryBuilder(AlimTalkTemplate, "att");
    } else {
      query = this.createQueryBuilder("att");
    }
    if (alimTalkTemplateCode) {
      query.andWhere("att.alimTalkTemplateCode = :alimTalkTemplateCode", {
        alimTalkTemplateCode,
      });
    }

    return query;
  }
}
