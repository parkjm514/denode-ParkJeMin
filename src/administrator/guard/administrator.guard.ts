import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionDto } from 'src/shared/dtos/session.dto';
import { commonConstants } from 'src/shared/constants/common.constants';
import { AdministratorService } from '../services/administrator.service';
import { FindAdministratorDto } from '../dtos/find-administrator.dto';
import _ from 'lodash';

@Injectable()
export class AdministratorGuard implements CanActivate {
  constructor(private administratorService: AdministratorService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = await context.switchToHttp().getRequest();
    const sessionDto = req['session'] as SessionDto;

    if (!sessionDto) {
      throw new UnauthorizedException({
        statusCode: 401,
        errorCode:
          commonConstants.errorMessages
            .COMMON_ERROR_MESSAGE_BEARER_TOKEN_NEEDED,
      });
    }

    const { accountId } = sessionDto;
    const findAdministratorDto: FindAdministratorDto = {
      accountId,
      accountJoin: true,
    };

    const administrator =
      await this.administratorService.getAdministrator(findAdministratorDto);

    const account = administrator.account;

    _.set(req, 'administrator', administrator);

    return !!administrator;
  }
}
