import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  // @Transform(({ value }) => JSON.parse(value))
  bedtype: string[];

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  number_of_guests: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  bedrooms: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  beds: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  bathrooms: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  // @Transform(({ value }) => JSON.parse(value))
  amenities: string[];

  @IsString()
  @IsNotEmpty()
  description: string;

  image_url?: string[];
}
