import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  ValidationPipe,
} from '@nestjs/common';
import { VenueService } from '../services/venue.service';
import { Role } from 'src/decorators/Auth.decorator';
import { CreateVenueDto } from '../dto/create-venue.dto';
import { ImageType } from 'src/types/Image.type';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';

import fs from 'fs';
import { updateVenueDto } from '../dto/update-venue.dto';

@Controller('api/v1/venue')
export class VenueController {
  constructor(
    private readonly venueService: VenueService,
    private cloudinary: CloudinaryService,
  ) {}

  @Post('createVenue')
  @Role('Admin', 'SuperAdmin')
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(ValidationPipe) createVenue: CreateVenueDto,
  ) {
    if (files.length === 0) {
      throw new BadRequestException({ message: 'Please upload an image' });
    } else {
      const uploaderImage = async (file: string) =>
        await this.cloudinary.ImageUploader(file, 'Hotel Rooms');

      const urls: ImageType = [];
      const public_image_id: string[] = [];

      if (Array.isArray(files)) {
        for (const file of files) {
          const { path } = file;
          const newPath = await uploaderImage(path);
          urls.push({ url: newPath.secure_url });
          public_image_id.push(newPath.public_id);
          fs.unlinkSync(file.path);
        }
      }

      const imageData = {
        urls,
        public_image_id,
      };

      return this.venueService.create(createVenue, imageData);
    }
  }

  @Get('getAllVenue')
  findMany(
    @Query('pages', ParseIntPipe) pages: number,
    @Query('search') search: string,
  ) {
    return this.venueService.findMany(pages, search);
  }

  @Get('deleteVenue/:id')
  delete(@Param('id') id: string) {
    return this.venueService.delete(id);
  }

  @Put('updateVenue/:id')
  @Role('Admin', 'SuperAdmin')
  updateOne(
    @Param('id') id: string,
    @Body(ValidationPipe) data: updateVenueDto,
  ) {
    return this.venueService.updateOne(id, data);
  }
}
