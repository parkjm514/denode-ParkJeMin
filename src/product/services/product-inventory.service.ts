import { ProductInventoryHistoryService } from './product-inventory-history.service';
import { GenerateProductInventoryHistoryDto } from '../dtos/generate-product-inventory-history.dto';
import { FindProductInventoryDto } from '../dtos/find-product-inventory.dto';
import { ModifyProductInventoryDto } from '../dtos/modify-product-inventory.dto';
import { DataSource, EntityManager } from 'typeorm';
import { ProductInventoryRepository } from '../repositories/product-inventory.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GenerateProductInventoryDto } from '../dtos/generate-product-inventory.dto';
import { constants, RecevingShippingType } from '../product.constants';
import { ProductService } from './product.service';
import { PaginationQueryDto } from 'src/shared/dtos/pagination.dto';
import { ProductInventory } from '../entities/product-inventory.entity';
import { ProductInventoryHistory } from '../entities/product-inventory-history.entity';

@Injectable()
export class ProductInventoryService {
  constructor(
    private dataSource: DataSource,
    private productService: ProductService,
    private productInventoryRepository: ProductInventoryRepository,
    private productInventoryHistoryService: ProductInventoryHistoryService,
  ) {}

  async createProductInventory(
    generateProductInventoryDto: GenerateProductInventoryDto,
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
      const { inventoryExpiredAt, remainingInventoryAmount, productId } =
        generateProductInventoryDto;

      // 입고 유효성 검사
      if (remainingInventoryAmount <= 0) {
        throw new BadRequestException({
          statusCode: 400,
          errorCode: constants.errorMessage.PRODUCT_INVENTORY_INVAILD_AMOUNT,
        });
      }
      if (inventoryExpiredAt < new Date()) {
        throw new BadRequestException({
          statusCode: 400,
          errorCode: constants.errorMessage.PRODUCT_INVENTORY_EXPIRED,
        });
      }
      const product = await this.productService.getProduct(
        { productId },
        runner.manager,
      );

      const productInventory =
        await this.productInventoryRepository.generateProductInventory(
          { ...generateProductInventoryDto, product },
          runner.manager,
        );
      const generateProductInventoryHistoryDto: GenerateProductInventoryHistoryDto =
        {
          product,
          recevingShippingAmount: remainingInventoryAmount,
          recevingShippingType: RecevingShippingType.RECEVING,
        };
      const productInventoryHistory =
        await this.productInventoryHistoryService.createProductInventoryHistory(
          generateProductInventoryHistoryDto,
          runner.manager,
        );

      if (!externalTransactionManager) {
        await runner.commitTransaction();
      }

      return productInventory;
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

  async getProductInventoryListAndCount(
    findProductInventoryDto: FindProductInventoryDto,
    pagination: PaginationQueryDto,
    transactionManager?: EntityManager,
  ) {
    return await this.productInventoryRepository.findProductInventoryListAndCount(
      findProductInventoryDto,
      pagination,
      transactionManager,
    );
  }

  async modifyProductInventory(
    modifyProductInventoryDto: ModifyProductInventoryDto,
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
      const { productId } = modifyProductInventoryDto;
      let shippingAmount =
        modifyProductInventoryDto.remainingInventoryAmount || 0;
      const findProductInventoryDto: FindProductInventoryDto = {
        productId,
        isValidRemaining: true,
        orderExpiredAt: true,
      };
      const product = await this.productService.getProduct(
        { productId },
        runner.manager,
      );
      const paginationQueryDto: PaginationQueryDto = {
        page: 1,
        pageSize: Number.MAX_SAFE_INTEGER,
      };
      let { list } = await this.getProductInventoryListAndCount(
        findProductInventoryDto,
        paginationQueryDto,
        runner.manager,
      );
      const productInventoryList = list;
      const newProductInventoryHistoryList: GenerateProductInventoryHistoryDto[] =
        [];
      const updateProductInventoryList: ProductInventory[] = [];
      let generateProductInventoryHistoryDto: GenerateProductInventoryHistoryDto;
      for (let productInventory of productInventoryList) {
        if (shippingAmount === 0) {
          break;
        }
        const { inventoryExpiredAt, remainingInventoryAmount, id } =
          productInventory;
        if (inventoryExpiredAt < new Date()) {
          productInventory.remainingInventoryAmount = 0;
          generateProductInventoryHistoryDto = {
            recevingShippingAmount: remainingInventoryAmount,
            recevingShippingType: RecevingShippingType.EXPERING,
            product,
          };
          newProductInventoryHistoryList.push(
            await this.productInventoryHistoryService.createProductInventoryHistory(
              generateProductInventoryHistoryDto,
              runner.manager,
            ),
          );
          updateProductInventoryList.push(
            await this.productInventoryRepository.updateProductInventory(
              { ...productInventory, productId },
              id,
              runner.manager,
            ),
          );
          continue;
        }
        if (shippingAmount < remainingInventoryAmount) {
          productInventory.remainingInventoryAmount =
            remainingInventoryAmount - shippingAmount;
          updateProductInventoryList.push(
            await this.productInventoryRepository.updateProductInventory(
              { ...productInventory, productId },
              id,
              runner.manager,
            ),
          );
          shippingAmount = 0;

          break;
        } else {
          shippingAmount -= remainingInventoryAmount;
          productInventory.remainingInventoryAmount = 0;
          updateProductInventoryList.push(
            await this.productInventoryRepository.updateProductInventory(
              { ...productInventory, productId },
              id,
              runner.manager,
            ),
          );
        }
      }
      generateProductInventoryHistoryDto = {
        recevingShippingAmount:
          modifyProductInventoryDto.remainingInventoryAmount || 0,
        recevingShippingType: RecevingShippingType.SHIPPING,
        product,
      };
      newProductInventoryHistoryList.push(
        await this.productInventoryHistoryService.createProductInventoryHistory(
          generateProductInventoryHistoryDto,
          runner.manager,
        ),
      );
      if (shippingAmount > 0) {
        throw new BadRequestException({
          statusCode: 400,
          errorCode: constants.errorMessage.PRODUCT_INVENTORY_NOT_ENOUGH,
        });
      }
      const productInventoryHistoryList = await Promise.all(
        newProductInventoryHistoryList,
      );
      const updatedProductList = await Promise.all(updateProductInventoryList);
      if (!externalTransactionManager) {
        await runner.commitTransaction();
      }

      return updatedProductList;
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
}
