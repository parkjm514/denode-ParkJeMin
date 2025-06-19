import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { AccountHistoryService } from 'src/account/services/account-history.service';
import { SessionDto } from '../dtos/session.dto';
import { commonConstants } from '../constants/common.constants';
import { AccountHistory } from 'src/account/entities/account-history.entity';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private accountHistoryService: AccountHistoryService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const sessionDto: SessionDto = req['session'];
    if (sessionDto) {
      const { accountHistoryId } = sessionDto;

      try {
        const accountHistory: AccountHistory =
          await this.accountHistoryService.getAccountHistory({
            accountHistoryId,
          });
        const { expiredAt } = accountHistory;
        if (expiredAt < new Date()) {
          throw new UnauthorizedException({
            statusCode: 401,
            errorCode: commonConstants.errorMessages.EXPIRED_TOKEN,
          });
        }
      } catch (e) {
        if (e.statusCode === 404) {
          throw new UnauthorizedException({
            statusCode: 401,
            errorCode: commonConstants.errorMessages.ACCOUNT_HISTORY_NOT_FOUND,
          });
        } else {
          throw e;
        }
      }
    }

    next();
  }
}
