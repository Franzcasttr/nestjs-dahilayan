import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class RidesService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(pages: number, search: string) {
    const page: number = Number(pages) || 1;
    const skip = (page - 1) * 10;
    const searchQuery = search?.toString();
    try {
      const rides = await this.prisma.rides.findMany({
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
        const numberOfPages = Math.ceil(rides.length / 10);
        return { rides, numberOfPages };
      } else {
        const totalRides = await this.prisma.rides.count();
        const numberOfPages = Math.ceil(totalRides / 10);
        return { rides, numberOfPages };
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
      const singleRide = await this.prisma.rides.findUnique({ where: { id } });
      return { singleRide };
    } catch (error) {
      if (error instanceof Error) {
        throw new NotFoundException('Unexpected Error ', error.message);
      } else {
        throw new BadRequestException(
          'Something went wrong please try again later!',
        );
      }
    }
  }
}
