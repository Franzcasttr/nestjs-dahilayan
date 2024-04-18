import { Module } from '@nestjs/common';
import { RoomsService } from './services/rooms.service';
import { RoomsController } from './controller/rooms.controller';
import { PrismaModule } from 'src/module/prisma/prisma.module';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';
import { FirebaseAdmin } from 'src/config/firebase.setup';

@Module({
  providers: [RoomsService, CloudinaryService, FirebaseAdmin],
  controllers: [RoomsController],
  imports: [PrismaModule],
})
export class AdminRoomsModule {}
