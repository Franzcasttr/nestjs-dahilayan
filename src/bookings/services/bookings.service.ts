import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async userBookingList(uid: string) {
    try {
      const result = await this.prisma.bookings.findMany({
        where: {
          userById: uid,
        },
        include: {
          roomBy: {
            select: {
              id: true,
              name: true,
              bathrooms: true,
              bedrooms: true,
              beds: true,
              number_of_guests: true,
              image_url: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return { result };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }

  async orderPaymentIntent(id: string) {
    const pid = id?.toString();
    try {
      const result = await this.prisma.bookings.findFirstOrThrow({
        where: {
          payment_intent_id: pid,
        },
        include: {
          roomBy: {
            select: {
              name: true,
              bathrooms: true,
              bedrooms: true,
              beds: true,
              number_of_guests: true,
            },
          },
          userBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return { result };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }
}
