import { Injectable } from "@nestjs/common";
import { BatchLogService } from "./batch-log.service";
import { Cron } from "@nestjs/schedule";
import { constants } from "../batch.constants";
import { GenerateBatchLogDto } from "./../dtos/generate-batch-log.dto";
import { AdministratorService } from "src/administrator/services/administrator.service";

@Injectable()
export class BatchService {
  constructor(
    private batchLogService: BatchLogService,
    private administratorService: AdministratorService
  ) {}

  @Cron("* * * * *")
  async getAdministratorCount() {
    console.log("TEST");
    const now = new Date();
    const batchName = constants.props.GET_ADMINISTRATORS_COUNT;
    const isBatchSuccess = false;
    let totalCount = 0;
    let successCount = 0;
    let failCount = 0;
    try {
      const findAdministratorDto = {};
      const administratorListAndCount =
        await this.administratorService.getAdministratorListAndCount(
          findAdministratorDto
        );
      totalCount = administratorListAndCount[0];
      successCount = administratorListAndCount[0];
    } catch (e) {
      if (e.status !== 404) {
        throw e;
      }
      failCount += 1;
    }
    const GenerateBatchLogDto: GenerateBatchLogDto = {
      isBatchSuccess,
      batchName,
      totalCount,
      successCount,
      failCount,
    };
    await this.batchLogService.createBatchLogService(GenerateBatchLogDto);
  }
}
