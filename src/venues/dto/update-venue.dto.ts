import { PartialType } from '@nestjs/mapped-types';
import { CreateVenueDto } from './create-venue.dto';

export class updateVenueDto extends PartialType(CreateVenueDto) {}
