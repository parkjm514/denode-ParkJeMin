import { SessionDto } from '../dtos/session.dto';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { commonConstants } from '../constants/common.constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers[commonConstants.props.AUTHORIZATION];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const sessionDto = jwt.verify(token, process.env.JWT_SECRET);

        req['session'] = sessionDto;
      } catch (e) {
        throw new UnauthorizedException({
          statusCode: 401,
          errorCode: commonConstants.errorMessages.INVALID_JWT_TOKEN,
        });
      }
    }
    next();
  }
}
