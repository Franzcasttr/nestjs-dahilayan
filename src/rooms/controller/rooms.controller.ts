import { Controller, Get, Param } from '@nestjs/common';
import { RoomsService } from '../services/rooms.service';

@Controller('api/v1/rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @Get('getRooms')
  findMany() {
    return this.roomService.findMany();
  }

  @Get('getsingleroom/:id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }
}
