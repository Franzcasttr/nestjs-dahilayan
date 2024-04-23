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

import { updateRidesDto } from '../dto/update-rides.dto';
import { CreateRidesDto } from '../dto/create-rides.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RidesService } from '../services/rides.service';

@Controller('api/v1/admin/rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post('create-rides')
  @Role('Admin', 'SuperAdmin')
  @UseInterceptors(FilesInterceptor('image_upload'))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(ValidationPipe) createRide: CreateRidesDto,
  ) {
    return this.ridesService.create(createRide, files);
  }

  @Get()
  findMany(
    // @Query('pages', ParseIntPipe) pages: number,
    @Query('pages') pages: number,
    @Query('search') search: string,
  ) {
    return this.ridesService.findMany(pages, search);
  }

  @Put('update-rides/:id')
  @Role('Admin', 'SuperAdmin')
  updateOne(
    @Param('id') id: string,
    @Body(ValidationPipe) data: updateRidesDto,
  ) {
    return this.ridesService.updateOne(id, data);
  }

  @Delete('delete-rides/:id')
  @Role('Admin', 'SuperAdmin')
  delete(@Param('id') id: string) {
    return this.ridesService.delete(id);
  }
}
