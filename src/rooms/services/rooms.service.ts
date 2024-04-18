import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    try {
      const rooms = await this.prisma.rooms.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          image_url: true,
        },
      });
      return { rooms };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }

  async findOne(id: string) {
    try {
      const singleRoom = await this.prisma.rooms.findUnique({
        where: {
          id,
        },
        include: {
          image_url: true,
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      return { singleRoom };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }
}
