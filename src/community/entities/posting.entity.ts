import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, Length } from "class-validator";
import { CoreEntity } from "src/shared/entities/core.entity";
import { Column, Entity } from "typeorm";
import { PostingCategory } from "../community.constants";

@Entity({ name: "Posting" })
export class Posting extends CoreEntity {
  @ApiProperty({
    description: "게시글 제목",
    required: true,
    example: "게시글 제목입니다.",
  })
  @IsString()
  @Length(1, 500)
  @Column({
    comment: "게시글 제목",
    type: "varchar",
    nullable: false,
    length: 500,
  })
  postingTitle: string;

  @ApiProperty({
    description: "게시글 내용",
    required: true,
    example: "게시글 내용입니다.",
  })
  @IsString()
  @Column({
    comment: "게시글 내용",
    type: "text",
    nullable: false,
  })
  postingContent: string;

  @ApiProperty({
    description: "게시글 이미지 링크",
    required: true,
    example: "www.naver.com",
  })
  @IsString()
  @Column({
    comment: "게시글 이미지 링크",
    type: "text",
    nullable: true,
  })
  postingImageLink: string;

  @ApiProperty({
    description: "게시글 동영상 링크",
    required: true,
    example: "www.youtube.com",
  })
  @IsString()
  @Column({
    comment: "게시글 동영상 링크",
    type: "text",
    nullable: true,
  })
  postingVideoLink: string;

  @ApiProperty({
    description: "게시글 카테고리",
    required: true,
    example: PostingCategory.CHAT,
  })
  @IsEnum(PostingCategory)
  @Column({
    comment: "게시글 카테고리",
    type: "enum",
    enum: PostingCategory,
    nullable: false,
  })
  postingCategory: PostingCategory;
}
