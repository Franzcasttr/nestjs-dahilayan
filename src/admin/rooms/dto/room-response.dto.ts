import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class RoomResponseDto {
  rooms: ({
    image_url: {
      id: string;
      name: string;
      url: Prisma.JsonValue;
      public_id: string[];
      roomImageById: string;
    }[];
  } & {
    id: string;
    name: string;
    price: number;
    bedtype: string[];
    number_of_guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    amenities: string[];
    description: string;
    rating: Decimal;
    createdAt: Date;
  })[];
}
