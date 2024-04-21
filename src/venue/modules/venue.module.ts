import { Module } from '@nestjs/common';
import { VenueController } from '../controllers/venue.controller';
import { VenueService } from '../services/venue.service';
import { PrismaModule } from 'src/module/prisma/prisma.module';

@Module({
  providers: [VenueController, VenueService],
  imports: [PrismaModule],
})
export class VenueModule {}
