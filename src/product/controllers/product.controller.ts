import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { swaggerConstants } from 'src/shared/constants/swagger.constants';
import { ProductService } from '../services/product.service';
import { Product } from '../entities/product.entity';
import { AdministratorGuard } from 'src/administrator/guard/administrator.guard';
import { GenerateProductDto } from '../dtos/generate-product.dto';
import { FindProductDto } from '../dtos/find-product.dto';
import { PaginationQueryDto } from 'src/shared/dtos/pagination.dto';
import {
  Pagination,
  PaginationParam,
} from 'src/shared/decorators/pagination.decorator';

@ApiTags('제품')
@Controller('products')
@ApiBearerAuth(swaggerConstants.auth.BEARER_TOKEN)
@UseGuards(AdministratorGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({ summary: '제품 등록' })
  @ApiResponse({
    status: 201,
    description: '제품 등록',
    type: Product,
  })
  @Post()
  async post(@Body() generateProductDto: GenerateProductDto) {
    const result = await this.productService.createProduct(generateProductDto);

    return result;
  }

  @ApiOperation({ summary: '제품 리스트 조회' })
  @ApiResponse({
    status: 200,
    description: '제품 리스트 조회',
    type: Product,
    isArray: true,
  })
  @Get()
  @Pagination()
  async gets(
    @Query() findProductDto: FindProductDto,
    @PaginationParam() pagination: PaginationQueryDto,
  ) {
    const result = await this.productService.getProductListAndCount(
      findProductDto,
      pagination,
    );

    return result;
  }
}
