import { FindProductDto } from '../dtos/find-product.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { constants } from '../product.constants';
import { GenerateProductDto } from '../dtos/generate-product.dto';
import { PaginationQueryDto } from 'src/shared/dtos/pagination.dto';
import { commonConstants } from 'src/shared/constants/common.constants';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async generateProduct(
    generateProductDto: GenerateProductDto,
    transactionManager: EntityManager,
  ) {
    let result;

    try {
      const instance = this.create(generateProductDto);
      if (transactionManager) {
        result = await transactionManager.save(Product, instance);
      } else {
        result = await this.save(instance);
      }
      return result;
    } catch (e) {
      if (e.code === commonConstants.props.UNIQUE_INDEX_ERROR) {
        if (e.sqlMessage?.includes(constants.props.UNIQUE_PRODUCT_NAME)) {
          throw new ConflictException({
            statusCode: 409,
            errorCode: constants.errorMessage.PRODUCT_CONFLICT_NAME.errorCode,
          });
        }

        throw e;
      }
    }
  }

  async findProduct(
    findProductDto: FindProductDto,
    transactionManager?: EntityManager,
  ) {
    const query = this.buildQuery(findProductDto, transactionManager);

    const result = await query.getOne();

    if (!result) {
      throw new NotFoundException({
        statusCode: 404,
        errorCode: constants.errorMessage.PRODUCT_NOT_FOUND,
      });
    }

    return result;
  }

  async findProductListAndCount(
    findProductDto: FindProductDto,
    pagination?: PaginationQueryDto,
    transactionManager?: EntityManager,
  ) {
    const query = this.buildQuery(findProductDto, transactionManager);

    if (pagination) {
      query
        .skip((pagination.page - 1) * pagination.pageSize)
        .take(pagination.pageSize);
    }

    const result = await query.getManyAndCount();

    if (!result || result[0].length === 0) {
      throw new NotFoundException({
        statusCode: 404,
        errorCode: constants.errorMessage.PRODUCT_NOT_FOUND,
      });
    }

    return { list: result[0], count: result[1] };
  }

  private buildQuery(
    findProductDto: FindProductDto,
    transactionManager?: EntityManager,
  ) {
    const { productId, productName } = findProductDto;

    let query;

    if (transactionManager) {
      query = transactionManager.createQueryBuilder(Product, 'p');
    } else {
      query = this.createQueryBuilder('p');
    }

    if (productId) {
      query.andWhere('p.id = :productId', { productId });
    }

    if (productName) {
      query.andWhere('p.productName LIKE :productName', {
        productName: `%${productName}%`,
      });
    }

    query.orderBy('p.id', 'DESC');

    return query;
  }
}
