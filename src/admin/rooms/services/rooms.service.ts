import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { ImageType } from 'src/types/Image.type';

import * as fs from 'fs';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(data: CreateRoomDto, files: Express.Multer.File[]) {
    const {
      amenities,
      bathrooms: room_bathrooms,
      bedrooms: room_bedrooms,
      beds: room_beds,
      bedtype,
      description,
      name,
      number_of_guests: room_guest,
      price: room_price,
    } = data;

    const price = parseInt(room_price.toString());
    const number_of_guests = parseInt(room_guest.toString());
    const bedrooms = parseInt(room_bedrooms.toString());
    const beds = parseInt(room_beds.toString());
    const bathrooms = parseInt(room_bathrooms.toString());

    const imageFile = files;
    if (imageFile?.length === 0) {
      throw new BadRequestException({ message: 'Please upload an image' });
    }
    const uploaderImage = async (path: string) => {
      try {
        return await this.cloudinary.ImageUploader(path, 'Hotel Rooms');
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
      await this.prisma.rooms.create({
        data: {
          name,
          image_url: {
            create: [
              {
                url: urls,
                name: name,
                public_id: public_image_id,
              },
            ],
          },
          price,
          bedtype,
          number_of_guests,
          bedrooms,
          beds,
          bathrooms,
          amenities,
          description,
        },
      });
      return { message: 'Success' };
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

  async search(pages: number, search: string) {
    const page: number = Number(pages) || 1;
    const skip = (page - 1) * 10;
    const searchQuery = search?.toString();
    try {
      const user = await this.prisma.rooms.findMany({
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
        include: {
          image_url: {},
        },
      });
      if (searchQuery) {
        const numberOfPages = Math.ceil(user.length / 10);
        return { user, numberOfPages };
      } else {
        const totalUser = await this.prisma.user.count();
        const numberOfPages = Math.ceil(totalUser / 10);
        return { user, numberOfPages };
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }

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

  async deleteOne(id: string) {
    const findImage = this.prisma.images.findMany({
      where: {
        roomImageById: id,
      },
    });

    const deleteImage = this.prisma.images.deleteMany({
      where: {
        roomImageById: id,
      },
    });

    const deleteRooms = this.prisma.rooms.delete({
      where: { id },
    });
    try {
      const result = await this.prisma.$transaction([
        findImage,
        deleteImage,
        deleteRooms,
      ]);
      if (result) {
        this.cloudinary.DeleteImage(result[0][0].public_id);
        return { message: 'Successfully deleted rooms' };
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }

  async updateOne(id: string, data: UpdateRoomDto) {
    const {
      image_url,
      amenities,
      bathrooms,
      bedrooms,
      beds,
      bedtype,
      description,
      name,
      number_of_guests,
      price,
    } = data;

    try {
      await this.prisma.rooms.update({
        where: {
          id,
        },
        data: {
          name,
          image_url: {
            updateMany: {
              where: {
                roomImageById: id,
              },
              data: {
                url: image_url,
              },
            },
          },
          price,
          bedtype,
          number_of_guests,
          bedrooms,
          beds,
          bathrooms,
          amenities,
          description,
        },
      });
      return { message: 'Successfully updated rooms' };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ message: error.message });
      } else {
        throw new BadRequestException({ message: 'Unexpected error', error });
      }
    }
  }
}
