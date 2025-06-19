import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CoreEntity {
  @ApiProperty({
    description: '데이터 ID(PK)',
    readOnly: true,
  })
  @PrimaryGeneratedColumn({ comment: '데이터 ID(PK)' })
  @Expose()
  id: number;

  @ApiProperty({
    description: '생성 일시',
    readOnly: true,
  })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdAt',
    comment: '생성 일시',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '수정 일시',
    readOnly: true,
  })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updatedAt',
    comment: '수정 일시',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: '삭제 일시',
    readOnly: true,
  })
  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deletedAt',
    comment: '삭제 일시',
  })
  @Expose()
  deletedAt: Date;
}
