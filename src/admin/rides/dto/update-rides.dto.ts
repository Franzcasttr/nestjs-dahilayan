import { PartialType } from '@nestjs/mapped-types';
import { CreateRidesDto } from './create-rides.dto';

export class updateRidesDto extends PartialType(CreateRidesDto) {}
