import { Module } from '@nestjs/common';
import { ReviewsController } from '../controller/reviews.controller';
import { PrismaModule } from 'src/module/prisma/prisma.module';
import { ReviewsService } from '../services/reviews.service';
import { FirebaseAdmin } from 'src/config/firebase.setup';

@Module({
  providers: [ReviewsService, FirebaseAdmin],
  controllers: [ReviewsController],
  imports: [PrismaModule],
})
export class ReviewsModule {}
