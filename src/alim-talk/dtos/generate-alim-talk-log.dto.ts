import { PickType } from "@nestjs/swagger";
import { AlimTalkLog } from "../entities/alim-talk-log.entity";

export class GenerateAlimTalkLogDto extends PickType(AlimTalkLog, [
  "alimTalkTitleLog",
  "alimTalkContentLog",
  "isSendingSuccess",
]) {}
