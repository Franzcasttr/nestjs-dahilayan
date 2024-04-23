import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { ImageType } from 'src/types/Image.type';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';

import * as fs from 'fs';
import { CreateVenueDto } from '../dto/create-venue.dto';
import { updateVenueDto } from '../dto/update-venue.dto';

@Injectable()
export class VenuesService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(data: CreateVenueDto, files: Express.Multer.File[]) {
    const { description, name, services } = data;

    const imageFile = files;
    if (imageFile?.length === 0) {
      throw new BadRequestException({ message: 'Please upload an image' });
    }
    const uploaderImage = async (path: string) => {
      try {
        return await this.cloudinary.ImageUploader(path, 'Hotel Venues');
      } catch (error) {
        if (error instanceof Error) {
          throw new BadRequestException({ message: error.message });
        }
      }
    };
    const urls: ImageType = [];
    const public_image_id: string[] = [];

    if (Array.isArray(imageFile)) {
      for (const file of imageFile) {
        const { path } = file;
        const newPath = await uploaderImage(path);
        urls.push({ url: newPath.secure_url });
        public_image_id.push(newPath.public_id);
        fs.unlinkSync(path);
      }
    }

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
      return { message: 'Successfully created' };
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
      return { deletedVenue, message: 'Venue successfully deleted' };
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
      return { message: 'Venue successfully updated' };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }
}
