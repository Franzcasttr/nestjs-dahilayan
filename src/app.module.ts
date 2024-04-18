import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { PrismaModule } from './module/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AdminUserModule } from './admin/users/module/admin-user.module';
import { RoomsModule } from './rooms/rooms.module';
import { AdminRoomsModule } from './admin/rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    UserModule,
    PrismaModule,
    AdminUserModule,
    AdminRoomsModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
