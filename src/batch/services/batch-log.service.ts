import { EntityManager } from "typeorm";
import { GenerateBatchLogDto } from "./../dtos/generate-batch-log.dto";
import { BatchLogRepository } from "./../repositories/batch-log.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BatchLogService {
  constructor(private batchLogRepository: BatchLogRepository) {}

  async createBatchLogService(
    generateBatchLogDto: GenerateBatchLogDto,
    transactionManager?: EntityManager
  ) {
    const result = await this.batchLogRepository.generateBatchLog(
      generateBatchLogDto,
      transactionManager
    );

    return result;
  }
}
