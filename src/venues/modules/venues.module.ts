import { Module } from '@nestjs/common';
import { VenuesController } from '../controllers/venues.controller';
import { VenuesService } from '../services/venues.service';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';
import { FirebaseAdmin } from 'src/config/firebase.setup';
import { PrismaModule } from 'src/module/prisma/prisma.module';

@Module({
  controllers: [VenuesController],
  providers: [VenuesService, CloudinaryService, FirebaseAdmin],
  imports: [PrismaModule],
})
export class VenuesModule {}
