import { Module } from '@nestjs/common';
import { AdminUserController } from '../controller/admin-user.controller';
import { AdminUsersService } from '../services/admin-users.service';
import { PrismaModule } from 'src/module/prisma/prisma.module';
import { FirebaseAdmin } from 'src/config/firebase.setup';

@Module({
  controllers: [AdminUserController],
  providers: [AdminUsersService, FirebaseAdmin],
  imports: [PrismaModule],
})
export class AdminUserModule {}
