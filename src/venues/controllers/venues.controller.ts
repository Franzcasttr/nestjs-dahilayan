import { Controller, Get, Param, Query } from '@nestjs/common';

import { VenuesService } from '../services/venues.service';

@Controller('api/v1/venues')
export class VenuesController {
  constructor(private readonly venueService: VenuesService) {}

  @Get()
  findMany(
    // @Query('pages', ParseIntPipe) pages: number,
    @Query('pages') pages: number,
    @Query('search') search: string,
  ) {
    return this.venueService.findMany(pages, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venueService.findOne(id);
  }
}
