import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { ImageType } from 'src/types/Image.type';
import { CreateVenueDto } from '../dto/create-venue.dto';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';
import { updateVenueDto } from '../dto/update-venue.dto';

@Injectable()
export class VenueService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    data: CreateVenueDto,
    imageData: { urls: ImageType; public_image_id: string[] },
  ) {
    const { name, services, description } = data;
    const { public_image_id, urls } = imageData;

    try {
      await this.prisma.venues.create({
        data: {
          name,
          image_url: urls,
          public_id: public_image_id,
          services,
          description,
        },
      });
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

  async delete(id: string) {
    try {
      const deletedVenue = await this.prisma.venues.delete({
        where: { id },
      });
      if (deletedVenue) {
        this.cloudinary.DeleteImage(deletedVenue.public_id);
        return { message: 'Successfully deleted rooms' };
      }
      return { deletedVenue, message: 'Successfully deleted rooms' };
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

  async updateOne(id: string, data: updateVenueDto) {
    const { name, image_url, services, description } = data;

    try {
      await this.prisma.venues.update({
        where: {
          id,
        },
        data: {
          name,
          image_url,
          services,
          description,
        },
      });
      return { message: 'Successfully updated rooms' };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }
}
