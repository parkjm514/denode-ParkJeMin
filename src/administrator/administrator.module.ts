import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from './entities/administrator.entity';
import { AdministratorController } from './controllers/administrator.controller';
import { AdministratorService } from './services/administrator.service';
import { AdministratorRepository } from './repositories/administrator.repository';
import { AccountModule } from 'src/account/account.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Administrator]), AccountModule],
  controllers: [AdministratorController],
  providers: [AdministratorService, AdministratorRepository],
  exports: [AdministratorService],
})
export class AdministratorModule {}
