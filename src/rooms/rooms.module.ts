import { Module } from '@nestjs/common';
import { RoomsService } from './services/rooms.service';
import { RoomsController } from './controller/rooms.controller';
import { PrismaModule } from 'src/module/prisma/prisma.module';

@Module({
  providers: [RoomsService],
  controllers: [RoomsController],
  imports: [PrismaModule],
})
export class RoomsModule {}
