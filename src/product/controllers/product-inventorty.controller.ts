import { ProductInventoryService } from '../services/product-inventory.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdministratorGuard } from 'src/administrator/guard/administrator.guard';
import { swaggerConstants } from 'src/shared/constants/swagger.constants';
import { ProductInventory } from '../entities/product-inventory.entity';
import { GenerateProductInventoryDto } from '../dtos/generate-product-inventory.dto';
import { FindProductInventoryDto } from '../dtos/find-product-inventory.dto';
import { PaginationQueryDto } from 'src/shared/dtos/pagination.dto';
import { ModifyProductInventoryDto } from '../dtos/modify-product-inventory.dto';
import {
  Pagination,
  PaginationParam,
} from 'src/shared/decorators/pagination.decorator';

@ApiTags('제품 재고')
@Controller('product-inventories')
@ApiBearerAuth(swaggerConstants.auth.BEARER_TOKEN)
@UseGuards(AdministratorGuard)
export class ProductInventoryController {
  constructor(private productInventoryService: ProductInventoryService) {}

  @ApiOperation({ summary: '제품 입고 등록' })
  @ApiResponse({
    status: 201,
    description: '제품 입고 등록',
    type: ProductInventory,
  })
  @Post()
  async post(@Body() generateProductInventoryDto: GenerateProductInventoryDto) {
    const result = await this.productInventoryService.createProductInventory(
      generateProductInventoryDto,
    );

    return result;
  }

  @ApiOperation({
    summary: '제품 재고 리스트 조회',
  })
  @ApiResponse({
    status: 200,
    description: '제품 재고 리스트 조회',
    type: ProductInventory,
    isArray: true,
  })
  @Get()
  @Pagination()
  async gets(
    @Query() findProductInventoryDto: FindProductInventoryDto,
    @PaginationParam() pagination: PaginationQueryDto,
  ) {
    const result =
      await this.productInventoryService.getProductInventoryListAndCount(
        findProductInventoryDto,
        pagination,
      );

    return result;
  }

  @ApiOperation({
    summary: '제품 출고 및 유통기한 만료 처리',
  })
  @ApiResponse({
    status: 204,
    description: '제품 출고 및 유통기한 만료 처리',
    type: ProductInventory,
    isArray: true,
  })
  @HttpCode(204)
  @Put()
  async put(@Body() modifyProductInventoryDto: ModifyProductInventoryDto) {
    const result = await this.productInventoryService.modifyProductInventory(
      modifyProductInventoryDto,
    );

    return;
  }
}
