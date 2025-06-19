import { PaginationQueryDto } from 'src/shared/dtos/pagination.dto';
import { FindProductInventoryHistoryDto } from '../dtos/find-product-inventory-history.dto';
import { GenerateProductInventoryHistoryDto } from '../dtos/generate-product-inventory-history.dto';
import { ProductInventoryHistoryRepository } from '../repositories/product-inventory-history.repository';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class ProductInventoryHistoryService {
  constructor(
    private dataSource: DataSource,
    private productInventoryHistoryRepository: ProductInventoryHistoryRepository,
  ) {}

  async createProductInventoryHistory(
    generateProductInventoryHistoryDto: GenerateProductInventoryHistoryDto,
    transactionManager?: EntityManager,
  ) {
    return await this.productInventoryHistoryRepository.generateProductInventoryHistory(
      generateProductInventoryHistoryDto,
      transactionManager,
    );
  }

  async getProductInventoryHistoryListAndCount(
    findProductInventoryHistoryDto: FindProductInventoryHistoryDto,
    pagination: PaginationQueryDto,
    transactionManager?: EntityManager,
  ) {
    return await this.productInventoryHistoryRepository.findProductInventoryHitosryListAndCount(
      findProductInventoryHistoryDto,
      pagination,
      transactionManager,
    );
  }
}
