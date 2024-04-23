import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { ImageType } from 'src/types/Image.type';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';

import * as fs from 'fs';
import { CreateRidesDto } from '../dto/create-rides.dto';
import { updateRidesDto } from '../dto/update-rides.dto';

@Injectable()
export class RidesService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(data: CreateRidesDto, files: Express.Multer.File[]) {
    const { description, name, price } = data;
    const priceToInt = parseInt(price.toString());
    const imageFile = files;
    if (imageFile?.length === 0) {
      throw new BadRequestException({ message: 'Please upload an image' });
    }
    const uploaderImage = async (path: string) => {
      try {
        return await this.cloudinary.ImageUploader(path, 'Hotel Rides');
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
      await this.prisma.rides.create({
        data: {
          name,
          image_url: urls,
          public_id: public_image_id,
          price: priceToInt,
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

  async delete(id: string) {
    const isExist = await this.prisma.rides.findUnique({ where: { id } });
    if (isExist) {
      try {
        const rides = await this.prisma.rides.delete({
          where: { id },
        });
        if (rides) {
          this.cloudinary.DeleteImage(rides.public_id);
          return { message: 'Successfully deleted rooms' };
        }
        return { rides, message: 'Venue successfully deleted' };
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
    throw new NotFoundException({ message: `Rides with ${id} was not found` });
  }

  async updateOne(id: string, data: updateRidesDto) {
    const { name, image_url, price, description } = data;
    const isExist = await this.prisma.rides.findUnique({ where: { id } });
    if (isExist) {
      try {
        await this.prisma.rides.update({
          where: {
            id,
          },
          data: {
            name,
            image_url,
            price,
            description,
          },
        });
        return { message: 'Venue successfully updated' };
      } catch (error) {
        if (error instanceof Error) {
          throw new BadRequestException({ errorMsg: error.message });
        } else {
          throw new BadRequestException({
            errorMsg: 'Unexpected error',
            error,
          });
        }
      }
    }
    throw new NotFoundException({ message: `Rides with ${id} was not found` });
  }
}
