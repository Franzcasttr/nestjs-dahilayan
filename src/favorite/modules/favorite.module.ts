import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/module/prisma/prisma.module';
import { FavoriteController } from '../controllers/favorite.controller';
import { FavoriteService } from '../services/favorite.service';
import { FirebaseAdmin } from 'src/config/firebase.setup';

@Module({
  providers: [FavoriteService, FirebaseAdmin],
  imports: [PrismaModule],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
