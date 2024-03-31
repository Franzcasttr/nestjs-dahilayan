import { Module } from '@nestjs/common';
import { AdminUserController } from '../controller/admin-user.controller';
import { AdminUsersService } from '../services/admin-users.service';
import { PrismaModule } from 'src/module/prisma/prisma.module';

@Module({
  controllers: [AdminUserController],
  providers: [AdminUsersService],
  imports: [PrismaModule],
})
export class AdminUserModule {}
