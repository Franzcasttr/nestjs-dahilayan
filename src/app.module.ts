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
import { OrderModule } from './orders/modules/order.module';
import { StripeModule } from './module/stripe/stripe.module';
import { WebhookController } from './module/stripe/webhook/webhook.controller';
import { VenueModule } from './venue/modules/venue.module';
import { VenueService } from './venue/services/venue.service';
import { AdminVenueModule } from './admin/venue/modules/venue.module';

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
    OrderModule,
    StripeModule,
    VenueModule,
    AdminVenueModule,
  ],
  controllers: [AppController, WebhookController],
  providers: [AppService, VenueService],
})
export class AppModule {}
