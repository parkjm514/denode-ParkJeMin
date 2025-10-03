import { DataSource, EntityManager, Repository } from "typeorm";
import { BatchLog } from "../entities/batch-log.entity";
import { Injectable } from "@nestjs/common";
import { GenerateBatchLogDto } from "../dtos/generate-batch-log.dto";

@Injectable()
export class BatchLogRepository extends Repository<BatchLog> {
  constructor(private dataSource: DataSource) {
    super(BatchLog, dataSource.createEntityManager());
  }

  async generateBatchLog(
    generateBatchLogDto: GenerateBatchLogDto,
    transactionManager?: EntityManager
  ) {
    let result;

    try {
      const instance = this.create(generateBatchLogDto);
      if (transactionManager) {
        result = await transactionManager.save(BatchLog, instance);
      } else {
        result = await this.save(instance);
      }
    } catch (e) {
      throw e;
    }
  }
}
