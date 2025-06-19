import { PaginationQueryDto } from 'src/shared/dtos/pagination.dto';
import { FindProductDto } from '../dtos/find-product.dto';
import { GenerateProductDto } from '../dtos/generate-product.dto';
import { ProductRepository } from '../repositories/product.repository';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    private dataSource: DataSource,
    private productRepository: ProductRepository,
  ) {}

  async createProduct(
    generateProductDto: GenerateProductDto,
    transactionManager?: EntityManager,
  ) {
    let runner;

    const externalTransactionManager = !!transactionManager;

    if (externalTransactionManager) {
      runner = { manager: transactionManager };
    } else {
      runner = this.dataSource.createQueryRunner();
    }
    if (!externalTransactionManager) {
      await runner.startTransaction();
    }
    try {
      const product = await this.productRepository.generateProduct(
        generateProductDto,
        runner.manager,
      );

      if (!externalTransactionManager) {
        await runner.commitTransaction();
      }

      return product;
    } catch (e) {
      if (!externalTransactionManager) {
        await runner.rollbackTransaction();
      }
      throw e;
    } finally {
      if (!externalTransactionManager) {
        await runner.release();
      }
    }
  }

  async getProduct(
    findProductDto: FindProductDto,
    transactionManager?: EntityManager,
  ) {
    return await this.productRepository.findProduct(
      findProductDto,
      transactionManager,
    );
  }

  async getProductListAndCount(
    findProductDto: FindProductDto,
    pagination?: PaginationQueryDto,
    transactionManager?: EntityManager,
  ) {
    return await this.productRepository.findProductListAndCount(
      findProductDto,
      pagination,
      transactionManager,
    );
  }
}
