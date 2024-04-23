import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class VenuesService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(pages: number, search: string) {
    const page: number = Number(pages) || 1;
    const skip = (page - 1) * 10;
    const searchQuery = search?.toString();
    try {
      const venues = await this.prisma.venues.findMany({
        skip,
        take: 10,
        where: {
          name: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (searchQuery) {
        const numberOfPages = Math.ceil(venues.length / 10);
        return { venues, numberOfPages };
      } else {
        const totalVenues = await this.prisma.venues.count();
        const numberOfPages = Math.ceil(totalVenues / 10);
        return { venues, numberOfPages };
      }
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
        where: { id },
      });

      if (singleVenue !== null) {
        return { singleVenue };
      } else {
        throw new NotFoundException({
          message: `Venue with ${id} was not found`,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new NotFoundException({ message: error.message });
      } else {
        throw new BadRequestException(
          'Something went wrong please try again later!',
        );
      }
    }
  }
}
