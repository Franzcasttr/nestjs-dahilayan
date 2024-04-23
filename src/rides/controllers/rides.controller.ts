import { Controller, Get, Param, Query } from '@nestjs/common';

import { RidesService } from '../services/rides.service';

@Controller('api/v1/rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Get()
  findMany(
    // @Query('pages', ParseIntPipe) pages: number,
    @Query('pages') pages: number,
    @Query('search') search: string,
  ) {
    return this.ridesService.findMany(pages, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ridesService.findOne(id);
  }
}
