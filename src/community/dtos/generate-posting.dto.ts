import { PickType } from "@nestjs/swagger";
import { Posting } from "../entities/posting.entity";

export class GeneratePostingDto extends PickType(Posting, [
  "postingCategory",
  "postingContent",
  "postingImageLink",
  "postingTitle",
  "postingVideoLink",
]) {}
