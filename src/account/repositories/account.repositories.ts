import { FindAccountDto } from '../dtos/find-account.dto';
import { GenerateAccountDto } from '../dtos/generate-account.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { constants } from '../account.constants';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { commonConstants } from 'src/shared/constants/common.constants';

@Injectable()
export class AccountRepository extends Repository<Account> {
  constructor(private dataSource: DataSource) {
    super(Account, dataSource.createEntityManager());
  }

  async createAccount(
    generateAccountDto: GenerateAccountDto,
    transactionManager?: EntityManager,
  ): Promise<Account> {
    try {
      let result;

      const instance = this.create(generateAccountDto);

      if (transactionManager) {
        result = await transactionManager.save(Account, instance);
      } else {
        result = await this.save(instance);
      }

      return result;
    } catch (e) {
      if (e.code === commonConstants.props.UNIQUE_INDEX_ERROR) {
        if (e.sqlMessage?.includes(constants.props.UNIQUE_ACCOUNT_EMAIL)) {
          {
            throw new ConflictException({
              statusCode: 409,
              errorCode:
                constants.errorMessage.ACCOUNT_CONFLICT_EMAIL.errorCode,
            });
          }
        }
      }
      throw e;
    }
  }

  async findAccount(
    findAccountDto: FindAccountDto,
    transactionManager?: EntityManager,
  ): Promise<Account> {
    const query = this.buildQuery(findAccountDto, transactionManager);

    const result = await query.getOne();

    if (!result) {
      throw new NotFoundException({
        statusCode: 404,
        errorCode: constants.errorMessage.ACCOUNT_NOT_FOUND,
      });
    }

    return result;
  }

  private buildQuery(
    findAccountDto: FindAccountDto,
    transactionManager?: EntityManager,
  ) {
    const { accountEmail } = findAccountDto;

    let query;

    if (transactionManager) {
      query = transactionManager.createQueryBuilder(Account, 'account');
    } else {
      query = this.createQueryBuilder('account');
    }

    if (accountEmail) {
      query.andWhere('account.accountEmail = :accountEmail', { accountEmail });
    }

    return query;
  }
}
