import { GenerateAlimTalkLogDto } from "./../dtos/generate-alim-talk-log.dto";
import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { AlimTalkLog } from "../entities/alim-talk-log.entity";

@Injectable()
export class AlimTalkLogRepository extends Repository<AlimTalkLog> {
  constructor(private dataSource: DataSource) {
    super(AlimTalkLog, dataSource.createEntityManager());
  }

  async createAlimTalkLog(
    generateAlimTalkLogDto: GenerateAlimTalkLogDto,
    transactionManager?: EntityManager
  ) {
    let result;

    try {
      const instance = this.create(generateAlimTalkLogDto);
      if (transactionManager) {
        result = await transactionManager.save(AlimTalkLog, instance);
      } else {
        result = await this.save(instance);
      }
      return result;
    } catch (e) {
      throw e;
    }
  }
}
