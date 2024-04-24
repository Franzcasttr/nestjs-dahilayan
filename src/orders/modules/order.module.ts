import { Module } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { OrdersController } from '../controllers/orders.controller';
import { FirebaseAdmin } from 'src/config/firebase.setup';
import { PrismaModule } from 'src/module/prisma/prisma.module';

@Module({
  providers: [OrdersService, FirebaseAdmin],
  controllers: [OrdersController],
  imports: [PrismaModule],
})
export class OrderModule {}
