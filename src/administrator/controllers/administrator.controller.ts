import { AdministratorService } from '../services/administrator.service';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { swaggerConstants } from 'src/shared/constants/swagger.constants';
import { Administrator } from '../entities/administrator.entity';
import { GenerateAdministratorDto } from '../dtos/generate-administrator.dto';
import { Response } from 'express';
import { AdministratorGuard } from '../guard/administrator.guard';
import { GetSession } from 'src/shared/decorators/get-session.decorator';
import { SessionDto } from 'src/shared/dtos/session.dto';
import { SignAdministratorDto } from '../dtos/sign-in-administrator.dto';

@ApiTags(swaggerConstants.tags.ADMINISTRATOR)
@Controller('administrators')
export class AdministratorController {
  constructor(private administratorService: AdministratorService) {}

  @ApiOperation({ summary: '관리자 회원 가입' })
  @ApiResponse({
    status: 201,
    description: '관리자 회원 생성',
    type: Administrator,
  })
  @Post()
  async post(
    @Body()
    generateAdministratorDto: GenerateAdministratorDto,
  ): Promise<Administrator> {
    const result = await this.administratorService.generateAdministrator(
      generateAdministratorDto,
    );

    return result;
  }

  @ApiOperation({ summary: '관리자 로그인' })
  @ApiResponse({
    status: 201,
    description: '관리자 로그인 완료',
    type: Administrator,
  })
  @Post('/login')
  async signIn(
    @Res() res: Response,
    @Body() signAdministratorDto: SignAdministratorDto,
  ) {
    const { administrator, sessionAccessToken } =
      await this.administratorService.signInAdministrator(signAdministratorDto);

    res.set('Authorization', `Bearer ${sessionAccessToken}`);

    res.json(administrator);
  }

  @ApiOperation({ summary: '관리자 로그아웃' })
  @ApiResponse({ status: 204, description: '관리자 로그아웃' })
  @ApiBearerAuth(swaggerConstants.auth.BEARER_TOKEN)
  @UseGuards(AdministratorGuard)
  @HttpCode(204)
  @Delete('/logout')
  async signOut(@GetSession() sessionDto: SessionDto) {
    await this.administratorService.signOutAdministrator(sessionDto.accountId);
  }
}
