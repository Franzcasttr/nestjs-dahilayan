import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateVenueDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  services: string[];

  @IsNotEmpty()
  @IsString()
  description: string;

  image_url?: string[];
}
