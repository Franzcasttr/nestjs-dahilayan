import { Module } from '@nestjs/common';
import { VenueController } from '../controllers/venue.controller';
import { VenueService } from '../services/venue.service';
import { PrismaModule } from 'src/module/prisma/prisma.module';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';
import { FirebaseAdmin } from 'src/config/firebase.setup';

@Module({
  providers: [VenueController, VenueService, CloudinaryService, FirebaseAdmin],
  imports: [PrismaModule],
})
export class AdminVenueModule {}
