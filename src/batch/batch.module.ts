import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BatchLog } from "./entities/batch-log.entity";
import { BatchLogService } from "./services/batch-log.service";
import { BatchService } from "./services/batch.service";
import { BatchLogRepository } from "./repositories/batch-log.repository";

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([BatchLog])],
  providers: [BatchLogService, BatchService, BatchLogRepository],
})
export class BatchModule {}
