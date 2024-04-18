import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('api/v1/bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}

  @Get('MyBookingList')
  @UseGuards(AuthGuard)
  userBookingList(@CurrentUser('uid') uid: string) {
    return this.bookingService.userBookingList(uid);
  }

  @Get('UserBookingPayment/:id')
  @UseGuards(AuthGuard)
  orderPaymentIntent(@Param('id') id: string) {
    return this.bookingService.orderPaymentIntent(id);
  }
}
