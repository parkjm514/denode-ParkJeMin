import { GenerateAdministratorDto } from "../dtos/generate-administrator.dto";
import { DataSource, EntityManager } from "typeorm";
import { FindAdministratorDto } from "../dtos/find-administrator.dto";
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { AdministratorRepository } from "../repositories/administrator.repository";
import { Administrator } from "../entities/administrator.entity";
import { AccountService } from "src/account/services/account.service";
import { FindAccountDto } from "src/account/dtos/find-account.dto";
import { constants } from "../administrator.constants";
import { bcryptCompare, bcryptHash } from "src/shared/helpers/crypto.helper";
import { GenerateAccountDto } from "src/account/dtos/generate-account.dto";
import { SignAdministratorDto } from "../dtos/sign-in-administrator.dto";
import _ from "lodash";
import { AccountHistoryService } from "src/account/services/account-history.service";
import { GenerateSessionAccessTokenDto } from "src/account/dtos/generate-session-access-token.dto";
import { GenerateAccountHistoryDto } from "src/account/dtos/generate-account-history.dto";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AdministratorService {
  constructor(
    private administratorRepository: AdministratorRepository,
    private accountService: AccountService,
    private accountHistoryService: AccountHistoryService,
    private dataSource: DataSource
  ) {}

  async generateAdministrator(
    generateAdministratorDto: GenerateAdministratorDto,
    transactionManager?: EntityManager
  ) {
    let runner;
    let existedAccount;
    const { email, password } = generateAdministratorDto;
    const externalTransactionManager = !!transactionManager;

    if (externalTransactionManager) {
      runner = { manager: transactionManager };
    } else {
      runner = this.dataSource.createQueryRunner();
    }
    if (!externalTransactionManager) await runner.startTransaction();

    try {
      try {
        let findAccountDto: FindAccountDto = {
          accountEmail: email,
        };
        existedAccount = await this.accountService.getAccount(
          findAccountDto,
          runner.manager
        );
      } catch (e) {
        if (e.status !== 404) {
          throw e;
        }
      }
      if (existedAccount) {
        throw new ConflictException({
          statusCode: 409,
          errorCode:
            constants.errorMessage.ADMINISTRATOR_CONFLICT_EMAIL.errorCode,
        });
      }
      const hashedPassword = await bcryptHash(password);
      const generateAccountDto: GenerateAccountDto = {
        accountEmail: email,
        password: hashedPassword,
      };
      const account = await this.accountService.generateAccount(
        generateAccountDto,
        runner.manager
      );

      let administrator =
        await this.administratorRepository.generateAdministrator(
          {
            ...generateAdministratorDto,
            account,
          },
          runner.manager
        );
      _.unset(administrator, "account.password");

      if (!externalTransactionManager) {
        await runner.commitTransaction();
      }

      return administrator;
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

  async getAdministrator(
    findAdministratorDto: FindAdministratorDto,
    transactionManager?: EntityManager
  ): Promise<Administrator> {
    const administrator = await this.administratorRepository.findAdministrator(
      findAdministratorDto,
      transactionManager
    );

    return administrator;
  }

  async signInAdministrator(signAdministratorDto: SignAdministratorDto) {
    const { accountEmail, password } = signAdministratorDto;
    const findAdministratorDto: FindAdministratorDto = {
      accountEmail,
      accountJoin: true,
    };

    let administrator = await this.administratorRepository.findAdministrator({
      ...findAdministratorDto,
      passwordLoadable: true,
    });

    const { account } = administrator;

    const isPasswordMatch = await bcryptCompare(password, account.password);

    if (!isPasswordMatch) {
      throw new BadRequestException({
        statusCode: 400,
        errorCode: constants.errorMessage.ADMINISTRATOR_NOT_MATCH_PASSWORD,
      });
    }

    _.unset(administrator, "account.password");
    let existedAccountHistories;
    try {
      const findAccountHistoryDto = { accountId: account.id };
      const { list, count } =
        await this.accountHistoryService.getAccountHistoriyListAndCount(
          findAccountHistoryDto
        );
      existedAccountHistories = list;
    } catch (e) {
      if (e.status !== 404) {
        throw e;
      }
      existedAccountHistories = null;
    }
    if (existedAccountHistories && existedAccountHistories.length > 0) {
      await this.accountHistoryService.removeAccountHistoryByAccountId(
        account.id
      );
    }
    let expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + constants.props.EXPIRED_DAY);
    const generateAccountHistoryDto: GenerateAccountHistoryDto = {
      account,
      expiredAt,
    };
    const accountHistory =
      await this.accountHistoryService.generateAccountHistory(
        generateAccountHistoryDto
      );

    const genetateSessionAccessToken: GenerateSessionAccessTokenDto = {
      accountId: account.id,
      accountHistoryId: accountHistory.id,
    };

    const sessionAccessToken = jwt.sign(
      genetateSessionAccessToken,
      process.env.JWT_SECRET
    );

    let result = { administrator, sessionAccessToken };

    return result;
  }

  async signOutAdministrator(accountId: number) {
    await this.accountHistoryService.removeAccountHistoryByAccountId(accountId);
  }
}
