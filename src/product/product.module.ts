import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductInventory } from './entities/product-inventory.entity';
import { ProductInventoryHistory } from './entities/product-inventory-history.entity';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';
import { ProductInventoryService } from './services/product-inventory.service';
import { ProductInventoryRepository } from './repositories/product-inventory.repository';
import { ProductInventoryHistoryService } from './services/product-inventory-history.service';
import { ProductInventoryHistoryRepository } from './repositories/product-inventory-history.repository';
import { ProductController } from './controllers/product.controller';
import { ProductInventoryController } from './controllers/product-inventorty.controller';
import { ProductInventoryHistoryController } from './controllers/product-inventory-history.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductInventory,
      ProductInventoryHistory,
    ]),
  ],
  controllers: [
    ProductController,
    ProductInventoryController,
    ProductInventoryHistoryController,
  ],
  providers: [
    ProductService,
    ProductRepository,
    ProductInventoryService,
    ProductInventoryRepository,
    ProductInventoryHistoryService,
    ProductInventoryHistoryRepository,
  ],
  exports: [],
})
export class ProductModule {}
