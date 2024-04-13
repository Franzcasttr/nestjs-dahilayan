import { $Enums } from '@prisma/client';

export interface IGetAllUserResponse {
  user: {
    id: string;
    name: string;
    date_of_birth: string;
    gender: string;
    email: string;
    image: string;
    phone_number: number;
    roles: $Enums.Roles[];
    userreviewId: string;
    createdAt: Date;
  }[];
  numberOfPages: number;
}
