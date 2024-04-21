import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class VenueService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    try {
      const venues = await this.prisma.venues.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return { venues };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException('Unexpected Error: ', error.message);
      } else {
        throw new BadRequestException(
          'Something went wrong please try again later!',
        );
      }
    }
  }

  async findOne(id: string) {
    try {
      const singleVenue = await this.prisma.venues.findUnique({
        where: {
          id,
        },
      });
      return { singleVenue };
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
