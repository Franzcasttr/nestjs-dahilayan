import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { Status } from '@prisma/client';
import { BookingsService } from '../services/bookings.service';
import { Role } from 'src/decorators/Auth.decorator';

@Controller('api/v1/bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}

  @Get('getAllBookings')
  @Role('Admin', 'SuperAdmin')
  findMany(@Query('pages') pages: number) {
    return this.bookingService.findMany(pages);
  }

  @Get('getCheckInOutCount')
  @Role('Admin', 'SuperAdmin')
  countCheckInOut() {
    return this.bookingService.countCheckInOut();
  }

  @Get('monthlySale')
  @Role('Admin', 'SuperAdmin')
  monthlySale() {
    return this.bookingService.monthlySale();
  }

  @Get('checkinoutgraph')
  @Role('Admin', 'SuperAdmin')
  status() {
    return this.bookingService.status();
  }

  @Get('doughnutchart')
  @Role('Admin', 'SuperAdmin')
  chart() {
    return this.bookingService.charts();
  }

  @Put('updateBooking/:id')
  update(@Param('id') id: string, status: Status) {
    return this.bookingService.update(id, status);
  }
}
