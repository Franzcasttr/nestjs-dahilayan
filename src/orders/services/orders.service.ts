import {
  BadRequestException,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentDto } from '../dto/payment.dto';
import { PrismaService } from 'src/module/prisma/prisma.service';

interface IObject {
  userById: string;
  check_in: string;
  check_out: string;
  room_type: string;
  paid: number;
  number_of_nights: number;
  number_of_guest: number;
}

@Injectable()
export class OrdersService {
  private stripe: Stripe;
  private webhookSecret = process.env.SIGN_IN_SECRET as string;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  async paymentIntent(paymentDto: PaymentDto) {
    const {
      check_in,
      check_out,
      number_of_guest,
      number_of_nights,
      paid,
      room_type,
      userById,
    } = paymentDto;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: paid * 100,
      currency: 'usd',
      metadata: {
        booking: JSON.stringify({
          userById,
          check_in,
          check_out,
          room_type,
          paid,
          number_of_nights,
          number_of_guest,
        }),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  async incomingEvents(req: RawBodyRequest<Request>) {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        this.webhookSecret,
      );
    } catch (err: any) {
      console.log(`Webhook Error: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object.metadata.booking;
    if (event.type === 'payment_intent.succeeded') {
      const payment_intent_id = event.data.object.id;
      return this.CreateOrderSuccess(data, payment_intent_id);
    }
  }

  private async CreateOrderSuccess(
    paymentMethod: string,
    payment_intent_id: string,
  ) {
    const bookingData = JSON.parse(paymentMethod) as IObject;
    const {
      check_in,
      check_out,
      number_of_nights,
      paid,
      room_type,
      userById,
      number_of_guest,
    } = bookingData;

    try {
      await this.prisma.bookings.create({
        data: {
          userById,
          check_in,
          check_out,
          paid,
          roomsById: room_type,
          number_of_nights,
          payment_intent_id,
          number_of_guest,
        },
      });
      return { message: 'Placed Order' };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException('Unexpected Error ', error.message);
      } else {
        throw new BadRequestException(
          'Something went wrong please try again later!',
        );
      }
    }
  }
}
