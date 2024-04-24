import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    const { comment, roomById, userId, Rate, bookingId } = createReviewDto;

    try {
      const result = await this.prisma
        .$executeRaw`;with create_review AS (INSERT INTO "Reviews" (id, "userId","comment","roomById","Rate") VALUES($1,$2,$3,$4,$5) RETURNING * , (${uuidv4()}, ${userId}, ${comment}, ${roomById}, ${Rate})), review_group AS (SELECT b.id, COALESCE(ROUND(AVG(c."Rate")::numeric, 1 ), 0) AS averageRating FROM "Rooms" b LEFT JOIN "Reviews" c ON c."roomById" = b.id GROUP BY b.id) UPDATE "Rooms" SET rating = averageRating FROM "Rooms" e INNER JOIN review_group ON e.id = review_group.id`;

      if (result === 1 || 2) {
        await this.prisma.bookings.update({
          where: {
            id: bookingId,
          },
          data: {
            toRate: 'rated',
          },
        });
      }
      return { message: 'Reviews created successfully' };
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
      const result = await this.prisma.reviews.findMany({
        where: {
          userId: uid,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
      return { result };
    } catch (error: any) {
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
