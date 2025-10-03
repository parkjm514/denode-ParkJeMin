import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString, Length } from "class-validator";
import { CoreEntity } from "src/shared/entities/core.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "BatchLog" })
export class BatchLog extends CoreEntity {
  @ApiProperty({
    description: "배치 성공 여부",
    example: true,
    required: true,
  })
  @IsBoolean()
  @Column({
    comment: "배치 성공 여부",
    type: "boolean",
    nullable: false,
  })
  isBatchSuccess: boolean;

  @ApiProperty({
    description: "배치 함수 명",
    example: "GET_ACCOUNT_COUNT",
    required: true,
  })
  @IsString()
  @Length(1, 1000)
  @Column({
    comment: "배치 함수 명",
    type: "varchar",
    length: 1000,
    nullable: false,
  })
  batchName: string;

  @ApiProperty({
    description: "총 횟수",
    example: 1,
    required: true,
  })
  @IsNumber()
  @Column({
    comment: "총 횟수",
    type: "int",
    nullable: false,
  })
  totalCount: number;

  @ApiProperty({
    description: "성공 횟수",
    example: 1,
    required: true,
  })
  @IsNumber()
  @Column({
    comment: "성공 횟수",
    type: "int",
    nullable: false,
  })
  successCount: number;

  @ApiProperty({
    description: "실패 횟수",
    example: 1,
    required: true,
  })
  @IsNumber()
  @Column({
    comment: "실패 횟수",
    type: "int",
    nullable: false,
  })
  failCount: number;
}
