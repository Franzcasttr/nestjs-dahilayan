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
    role: $Enums.Role;
    userreviewId: string;
    createdAt: Date;
  }[];
  numberOfPages: number;
}
