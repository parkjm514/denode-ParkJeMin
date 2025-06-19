import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { ApiQuery } from '@nestjs/swagger';

export const PaginationParam = createParamDecorator(
  (data: unknown, context: ExecutionContext): PaginationQueryDto => {
    const req = context.switchToHttp().getRequest();
    const { page, pageSize } = { ...req.query };
    const pagination = plainToInstance(
      PaginationQueryDto,
      { page, pageSize },
      {
        enableImplicitConversion: true,
      },
    );
    return pagination;
  },
);

export function Pagination() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: '페이지 숫자',
      example: 1,
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      type: Number,
      description: '페이지 사이즈',
      example: 10,
    }),
  );
}
