import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(uid: string, productID: string) {
    try {
      const result = await this.prisma.favorite.create({
        data: {
          favoriteId: uid,
          roomProductId: productID,
        },
      });
      return { result };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ message: error.message });
      } else {
        throw new BadRequestException({
          message: 'Unexpected error',
          error,
        });
      }
    }
  }

  async findMany(uid: string) {
    try {
      const result = await this.prisma.favorite.findMany({
        where: {
          favoriteId: uid,
        },
        include: {
          roomProduct: {
            select: {
              number_of_guests: true,
              image_url: true,
              name: true,
              price: true,
            },
          },
        },
      });
      return { result };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ message: error.message });
      } else {
        throw new BadRequestException({
          message: 'Unexpected error',
          error,
        });
      }
    }
  }

  async remove(uid: string, productID: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: uid,
        },
        data: {
          favorite: {
            deleteMany: { roomProductId: productID },
          },
        },
      });
      return { message: 'Successfully deleted' };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ message: error.message });
      } else {
        throw new BadRequestException({
          message: 'Unexpected error',
          error,
        });
      }
    }
  }
}
