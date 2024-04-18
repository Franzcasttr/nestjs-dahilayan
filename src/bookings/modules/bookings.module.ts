import { Module } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { FirebaseAdmin } from 'src/config/firebase.setup';
import { BookingsController } from '../controllers/bookings.controller';

@Module({
  providers: [BookingsService, PrismaService, FirebaseAdmin],
  controllers: [BookingsController],
})
export class BookingsModule {}
