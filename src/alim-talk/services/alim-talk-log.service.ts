import { Injectable } from "@nestjs/common";
import { AlimTalkLogRepository } from "../repositories/alim-talk-log.repository";
import { GenerateAlimTalkLogDto } from "../dtos/generate-alim-talk-log.dto";
import { EntityManager } from "typeorm";

@Injectable()
export class AlimTalkLogService {
  constructor(private alimTalkLogRepository: AlimTalkLogRepository) {}

  async generateAlimTalkLog(
    generateAlimTalkLogDto: GenerateAlimTalkLogDto,
    transactionManager?: EntityManager
  ) {
    return await this.alimTalkLogRepository.createAlimTalkLog(
      generateAlimTalkLogDto,
      transactionManager
    );
  }
}
