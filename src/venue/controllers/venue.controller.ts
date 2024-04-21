import { Controller, Get, Param } from '@nestjs/common';
import { VenueService } from '../services/venue.service';

@Controller('api/v1/venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Get('getVenues')
  findMany() {
    return this.venueService.findMany();
  }

  @Get('getsinglevenue/:id')
  findOne(@Param('id') id: string) {
    return this.venueService.findOne(id);
  }
}
