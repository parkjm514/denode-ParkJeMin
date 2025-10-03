import { PartialType, PickType } from "@nestjs/swagger";
import { BatchLog } from "../entities/batch-log.entity";

export class GenerateBatchLogDto extends PickType(BatchLog, [
  "isBatchSuccess",
  "batchName",
  "totalCount",
  "successCount",
  "failCount",
]) {}
