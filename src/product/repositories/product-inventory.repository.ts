import { ModifyProductInventoryDto } from '../dtos/modify-product-inventory.dto';
import { FindProductInventoryDto } from '../dtos/find-product-inventory.dto';
import { GenerateProductInventoryDto } from '../dtos/generate-product-inventory.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, Repository, UpdateResult } from 'typeorm';
import { ProductInventory } from '../entities/product-inventory.entity';
import { PaginationQueryDto } from 'src/shared/dtos/pagination.dto';
import { constants } from '../product.constants';

@Injectable()
export class ProductInventoryRepository extends Repository<ProductInventory> {
  constructor(private dataSource: DataSource) {
    super(ProductInventory, dataSource.createEntityManager());
  }

  async generateProductInventory(
    generateProductInventoryDto: GenerateProductInventoryDto,
    transactionManager?: EntityManager,
  ) {
    let result;

    try {
      const instance = this.create(generateProductInventoryDto);
      if (transactionManager) {
        result = await transactionManager.save(ProductInventory, instance);
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

  async findProductInventoryListAndCount(
    findProductInventoryDto: FindProductInventoryDto,
    pagination?: PaginationQueryDto,
    transactionManager?: EntityManager,
  ): Promise<{ list: ProductInventory[]; count: number }> {
    const query = this.buildQuery(findProductInventoryDto, transactionManager);

    if (pagination) {
      query
        .skip((pagination.page - 1) * pagination.pageSize)
        .take(pagination.pageSize);
    }

    const result = await query.getManyAndCount();

    if (!result || result[0].length === 0) {
      throw new NotFoundException({
        statusCode: 404,
        errorCode: constants.errorMessage.PRODUCT_INVENTORY_NOT_FOUND,
      });
    }

    return { list: result[0], count: result[1] };
  }

  async updateProductInventory(
    modifyProductInventoryDto: ModifyProductInventoryDto,
    id: number,
    transactionManager?: EntityManager,
  ) {
    let result;
    let instance: ProductInventory = this.create({
      ...modifyProductInventoryDto,
    });
    if (transactionManager) {
      result = await transactionManager.update(ProductInventory, id, instance);
    } else {
      result = await this.update(id, instance);
    }

    if (!result || result.affected === 0) {
      throw new BadRequestException({
        status: 400,
        errorMessage: constants.errorMessage.PRODUCT_INVENTORY_FAIL_TO_UPDATE,
      });
    }

    return result;
  }

  private buildQuery(
    findProductInventoryDto: FindProductInventoryDto,
    transactionManager?: EntityManager,
  ) {
    const { productId, isValidRemaining, orderExpiredAt } =
      findProductInventoryDto;

    let query;

    if (transactionManager) {
      query = transactionManager.createQueryBuilder(ProductInventory, 'pi');
    } else {
      query = this.createQueryBuilder('pi');
    }
    if (isValidRemaining) {
      query.andWhere('pi.remainingInventoryAmount > 0');
    }

    if (productId) {
      query.leftJoinAndSelect('pi.product', 'p');
      query.andWhere('p.id = :productId', { productId });
    }

    if (orderExpiredAt) {
      query.orderBy('pi.inventoryExpiredAt', 'ASC');
    } else {
      query.orderBy('pi.id', 'DESC');
    }

    return query;
  }
}
