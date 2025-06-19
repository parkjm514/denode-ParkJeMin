import { ProductInventoryHistoryService } from '../services/product-inventory-history.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdministratorGuard } from 'src/administrator/guard/administrator.guard';
import { swaggerConstants } from 'src/shared/constants/swagger.constants';
import { ProductInventoryHistory } from '../entities/product-inventory-history.entity';
import {
  Pagination,
  PaginationParam,
} from 'src/shared/decorators/pagination.decorator';
import { FindProductInventoryHistoryDto } from '../dtos/find-product-inventory-history.dto';
import { PaginationQueryDto } from 'src/shared/dtos/pagination.dto';

@ApiTags('제품 입출고 이력')
@Controller('product-inventory-histories')
@ApiBearerAuth(swaggerConstants.auth.BEARER_TOKEN)
@UseGuards(AdministratorGuard)
export class ProductInventoryHistoryController {
  constructor(
    private productInventoryHistoryService: ProductInventoryHistoryService,
  ) {}

  @ApiOperation({
    summary: '제품 입출력 이력 리스트 조회',
  })
  @ApiResponse({
    status: 200,
    description: '제품 입출력 이력 리스트 조회',
    type: ProductInventoryHistory,
    isArray: true,
  })
  @Pagination()
  @Get()
  async gets(
    @Query() findProductInventoryHistoryDto: FindProductInventoryHistoryDto,
    @PaginationParam() pagination: PaginationQueryDto,
  ) {
    const result =
      await this.productInventoryHistoryService.getProductInventoryHistoryListAndCount(
        findProductInventoryHistoryDto,
        pagination,
      );

    return result;
  }
}
