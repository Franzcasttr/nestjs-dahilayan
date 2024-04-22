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
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRoomDto } from '../dto/create-room.dto';
import { RoomsService } from '../services/rooms.service';
import { Role } from 'src/decorators/Auth.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/admin/rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @Post('create-room')
  @Role('Admin', 'SuperAdmin')
  @UseInterceptors(FilesInterceptor('image_upload'))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(ValidationPipe) createRoomDto: CreateRoomDto,
  ) {
    return this.roomService.create(createRoomDto, files);
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
    @Body(ValidationPipe) updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomService.updateOne(id, updateRoomDto);
  }
}
