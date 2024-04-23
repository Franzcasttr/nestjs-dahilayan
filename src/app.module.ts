import { Global, Module } from '@nestjs/common';
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
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminVenuesModule } from './admin/venues/modules/venues.module';
import { VenuesModule } from './venues/modules/venues.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      expandVariables: true,
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
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
    VenuesModule,
    AdminVenuesModule,
  ],
  controllers: [AppController, WebhookController],
  providers: [AppService],
  exports: [MulterModule],
})
export class AppModule {}
