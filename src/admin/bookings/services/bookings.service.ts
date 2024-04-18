import { BadRequestException, Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(pages: number) {
    const page: number = Number(pages) || 1;
    const skip = (page - 1) * 10;

    try {
      const result = await this.prisma.bookings.findMany({
        skip,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          userBy: {
            select: {
              name: true,
              image: true,
            },
          },
          roomBy: {
            select: {
              name: true,
            },
          },
        },
      });

      const totalBookings = await this.prisma.bookings.count();
      const numberOfPages = Math.ceil(totalBookings / 10);
      return { bookings: result, numberOfPages, totalBookings };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }

  async countCheckInOut() {
    try {
      const result = await this.prisma
        .$queryRaw`SELECT COUNT(*) FILTER (WHERE "status" = ANY ('{Check_In}'))::real AS "CHECKIN",COUNT(*) FILTER (WHERE "status" = ANY ('{Check_Out}'))::real AS "CHECKOUT" FROM "Bookings"`;

      return { result };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }

  async monthlySale() {
    try {
      const result = await this.prisma
        .$queryRaw`SELECT DATE_TRUNC('month',"createdAt") AS "monthly", SUM(paid::real) AS "sale" FROM public."Bookings" GROUP BY "monthly" ORDER BY
          "monthly" ASC`;
      return { result };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }

  async status() {
    try {
      const result = await this.prisma
        .$queryRaw`SELECT DATE_TRUNC('month',"createdAt") AS "monthly", COUNT(*) FILTER (WHERE "status" = ANY ('{Check_In}'))::real AS "CHECKIN",COUNT(*) FILTER (WHERE "status" = ANY ('{Check_Out}'))::real AS "CHECKOUT" FROM "Bookings" GROUP BY "monthly" ORDER BY "monthly" ASC`;

      return { result };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }

  async charts() {
    try {
      const result = await this.prisma.$queryRaw`SELECT 
        COUNT(*) FILTER (WHERE "status" = ANY ('{Pending}'))::real AS "Pending",
        COUNT(*) FILTER (WHERE "status" = ANY ('{Booked}'))::real AS "Booked",
        COUNT(*) FILTER (WHERE "status" = ANY ('{Cancelled}'))::real AS "Cancelled"
         FROM "Bookings"`;

      return { result };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }

  async update(id: string, status: Status) {
    try {
      const result = await this.prisma.bookings.update({
        where: { id },
        data: {
          status,
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
