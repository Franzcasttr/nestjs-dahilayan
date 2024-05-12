import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { RoomResponseDto } from '../dto/room-response.dto';
import { PrismaService } from '../../../module/prisma/prisma.service';
import { CloudinaryService } from '../../../cloudinary/services/cloudinary.service';
import { BadRequestException } from '@nestjs/common';

describe('RoomsService', () => {
  let service: RoomsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;

  const prismaMock = {
    rooms: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockRooms: RoomResponseDto = {
    rooms: [
      {
        id: 'idfb',
        name: 'Deluxe room',
        price: 1253,
        bedtype: ['queen'],
        number_of_guests: 5,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        amenities: ['wifi'],
        description: 'This is the best room you can find in this area',
        rating: null,
        createdAt: new Date(Date.now()),
        image_url: [
          {
            id: 'ids3434-dsfds',
            name: 'First test',
            url: [
              {
                url: 'image url',
              },
            ],
            public_id: ['public id'],
            roomImageById: 'random room id',
          },
        ],
      },
    ],
  };
  // const mockRooms: RoomResponseDto = {
  //   rooms: [
  //     {
  //       id: 'idfb',
  //       name: 'Deluxe room',
  //       price: 1253,
  //       bedtype: ['queen'],
  //       number_of_guests: 5,
  //       bedrooms: 2,
  //       beds: 2,
  //       bathrooms: 2,
  //       amenities: ['wifi'],
  //       description: 'This is the best room you can find in this area',
  //       rating: null,
  //       createdAt: new Date(Date.now()),
  //       image_url: [
  //         {
  //           id: 'ids3434-dsfds',
  //           name: 'First test',
  //           url: [
  //             {
  //               url: 'image url',
  //             },
  //           ],
  //           public_id: ['public id'],
  //           roomImageById: 'random room id',
  //         },
  //       ],
  //     },
  //   ],
  // };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        RoomsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    prisma = module.get<PrismaService>(PrismaService);
    prismaMock.rooms.findMany.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany', () => {
    it('should return an array of rooms', async () => {
      jest.spyOn(service, 'findMany').mockResolvedValue(mockRooms);
      // prismaMock.rooms.findMany.mockResolvedValue(mockRooms);
      // prisma.rooms.findMany = jest.fn().mockReturnValueOnce(rooms);

      const result = await service.findMany();
      expect(result.rooms).toEqual(mockRooms.rooms);
    });

    it('should return BadRequest if no rooms are found', async () => {
      prismaMock.rooms.findMany.mockResolvedValue([]);

      try {
        await service.findMany();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('No rooms found');
        expect(error.status).toBe(400);
      }
    });
  });
});
