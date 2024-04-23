import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

import { Role } from 'src/decorators/Auth.decorator';

import { VenuesService } from '../services/venues.service';
import { updateVenueDto } from '../dto/update-venue.dto';
import { CreateVenueDto } from '../dto/create-venue.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/admin/venues')
export class VenuesController {
  constructor(private readonly venueService: VenuesService) {}

  @Post('create-venue')
  @Role('Admin', 'SuperAdmin')
  @UseInterceptors(FilesInterceptor('image_upload'))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(ValidationPipe) createVenue: CreateVenueDto,
  ) {
    return this.venueService.create(createVenue, files);
  }

  @Get()
  findMany(
    // @Query('pages', ParseIntPipe) pages: number,
    @Query('pages') pages: number,
    @Query('search') search: string,
  ) {
    return this.venueService.findMany(pages, search);
  }

  @Put('update-venue/:id')
  @Role('Admin', 'SuperAdmin')
  updateOne(
    @Param('id') id: string,
    @Body(ValidationPipe) data: updateVenueDto,
  ) {
    return this.venueService.updateOne(id, data);
  }

  @Delete('delete-venue/:id')
  @Role('Admin', 'SuperAdmin')
  delete(@Param('id') id: string) {
    return this.venueService.delete(id);
  }
}
