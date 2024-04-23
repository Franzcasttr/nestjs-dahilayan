import { Module } from '@nestjs/common';

import { RidesService } from '../services/rides.service';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';
import { FirebaseAdmin } from 'src/config/firebase.setup';
import { PrismaModule } from 'src/module/prisma/prisma.module';
import { RidesController } from '../controllers/rides.controller';

@Module({
  controllers: [RidesController],
  providers: [RidesService, CloudinaryService, FirebaseAdmin],
  imports: [PrismaModule],
})
export class AdminRidesModule {}
