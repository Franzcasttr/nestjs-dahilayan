import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { PrismaModule } from './module/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AdminUserModule } from './admin/users/module/admin-user.module';
import { RoomsModule } from './rooms/rooms.module';
import { AdminRoomsModule } from './admin/rooms/rooms.module';
import { AdminBookingsModule } from './admin/bookings/modules/bookings.module';
import { BookingsModule } from './bookings/modules/bookings.module';

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
    AdminBookingsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
