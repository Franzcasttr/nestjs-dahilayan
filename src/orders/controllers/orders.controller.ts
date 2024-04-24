import {
  Controller,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { PaymentDto } from '../dto/payment.dto';

@Controller('api/v1/order')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post('create-payment-intent')
  @UseGuards(AuthGuard)
  paymentIntent(paymentDto: PaymentDto) {
    return this.orderService.paymentIntent(paymentDto);
  }

  @Post('webhook')
  async incomingEvents(@Req() req: RawBodyRequest<Request>) {
    return this.orderService.incomingEvents(req);
  }
}
