import { FindProductInventoryHistoryDto } from '../dtos/find-product-inventory-history.dto';
import { GenerateProductInventoryHistoryDto } from '../dtos/generate-product-inventory-history.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ProductInventoryHistory } from '../entities/product-inventory-history.entity';
import { PaginationQueryDto } from 'src/shared/dtos/pagination.dto';
import { constants } from '../product.constants';

@Injectable()
export class ProductInventoryHistoryRepository extends Repository<ProductInventoryHistory> {
  constructor(private dataSource: DataSource) {
    super(ProductInventoryHistory, dataSource.createEntityManager());
  }

  async generateProductInventoryHistory(
    generateProductInventoryHistoryDto: GenerateProductInventoryHistoryDto,
    transactionManager?: EntityManager,
  ) {
    let result;

    try {
      const instance = this.create(generateProductInventoryHistoryDto);
      if (transactionManager) {
        result = await transactionManager.save(
          ProductInventoryHistory,
          instance,
        );
      } else {
        result = await this.save(instance);
      }
      return result;
    } catch (e) {
      switch (e.constraint) {
        default:
          throw e;
      }
    }
  }

  async findProductInventoryHitosryListAndCount(
    findProductInventoryHistoryDto: FindProductInventoryHistoryDto,
    pagination?: PaginationQueryDto,
    transactionManager?: EntityManager,
  ) {
    const query = this.buildQuery(
      findProductInventoryHistoryDto,
      transactionManager,
    );

    if (pagination) {
      query
        .skip((pagination.page - 1) * pagination.pageSize)
        .take(pagination.pageSize);
    }

    const result = await query.getManyAndCount();

    if (!result || result[0].length === 0) {
      throw new NotFoundException({
        statusCode: 404,
        errorCode: constants.errorMessage.PRODUCT_INVENTORY_HISTORY_NOT_FOUND,
      });
    }

    return { list: result[0], count: result[1] };
  }

  private buildQuery(
    findProductInventoryHistoryDto: FindProductInventoryHistoryDto,
    transactionManager?: EntityManager,
  ) {
    const { productId, recevingShippingType } = findProductInventoryHistoryDto;

    let query;

    if (transactionManager) {
      query = transactionManager.createQueryBuilder(
        ProductInventoryHistory,
        'pih',
      );
    } else {
      query = this.createQueryBuilder('pih');
    }

    if (recevingShippingType) {
      query.andWhere('pih.recevingShippingType = :recevingShippingType', {
        recevingShippingType,
      });
    }

    if (productId) {
      query.leftJoinAndSelect('pih.product', 'p');
      query.andWhere('p.id = :productId', { productId });
    }

    query.orderBy('pih.id', 'DESC');

    return query;
  }
}
