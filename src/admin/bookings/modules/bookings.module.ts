import { Module } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { BookingsController } from '../controller/bookings.controller';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { FirebaseAdmin } from 'src/config/firebase.setup';

@Module({
  providers: [BookingsService, PrismaService, FirebaseAdmin],
  controllers: [BookingsController],
  imports: [],
})
export class AdminBookingsModule {}
