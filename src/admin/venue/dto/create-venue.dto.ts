import { IsString } from 'class-validator';

export class CreateVenueDto {
  @IsString()
  name: string;
  @IsString()
  services: string[];
  @IsString()
  description: string;

  image_url?: string[];
}
