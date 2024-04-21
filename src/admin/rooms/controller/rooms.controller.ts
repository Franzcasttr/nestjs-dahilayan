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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRoomDto } from '../dto/create-room.dto';
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';
import fs from 'fs';
import { RoomsService } from '../services/rooms.service';
import { Role } from 'src/decorators/Auth.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { ImageType } from 'src/types/Image.type';

@Controller('api/v1/admin/rooms')
export class RoomsController {
  constructor(
    private readonly roomService: RoomsService,
    private cloudinary: CloudinaryService,
  ) {}

  @Post('create-room')
  @Role('Admin', 'SuperAdmin')
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(ValidationPipe) createRoomDto: CreateRoomDto,
  ) {
    const imageFile = files;
    if (imageFile?.length === 0) {
      return { message: 'Please upload an image' };
    } else {
      const uploaderImage = async (file: string) =>
        await this.cloudinary.ImageUploader(file, 'Hotel Rooms');
      const urls: ImageType = [];
      const public_image_id: string[] = [];

      if (Array.isArray(imageFile)) {
        for (const file of imageFile) {
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
      this.roomService.create(createRoomDto, imageData);
    }
  }

  @Get('view')
  search(@Query('pages') pages: number, @Query('search') search: string) {
    return this.roomService.search(pages, search);
  }

  @Get('getallrooms')
  @UseGuards(AuthGuard)
  findMany() {
    return this.roomService.findMany();
  }

  @Delete('deleteroom/:id')
  @Role('Admin', 'SuperAdmin')
  deleteOne(@Param('id') id: string) {
    return this.roomService.deleteOne(id);
  }

  @Put('updateroom/:id')
  @Role('Admin', 'SuperAdmin')
  updateOne(
    @Param('id') id: string,
    @Body(ValidationPipe) data: UpdateRoomDto,
  ) {
    return this.roomService.updateOne(id, data);
  }
}
