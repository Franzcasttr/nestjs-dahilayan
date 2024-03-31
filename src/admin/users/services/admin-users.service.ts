import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { getAuth } from 'firebase-admin/auth';
import { IGetAllUserResponse } from '../interface/getAllUserResponse.interface';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<{ msg: string }> {
    try {
      await getAuth()
        .createUser({
          displayName: data.name,
          email: data.email,
          password: data.password,
          photoURL:
            'https://res.cloudinary.com/dyvisacbu/image/upload/v1664698266/Hotel%20User%20Image/1664698260709-account_ttr2cd.png',
        })
        .then(async (user) => {
          await this.prisma.user.create({
            data: {
              id: user.uid,
              name: user.displayName,
              email: user.email,
            },
          });
        });

      return { msg: 'Successfully Created!' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Something went wrong please try again later!',
      );
    }
  }

  async setCustomClaim(uid: string) {
    try {
      await getAuth().setCustomUserClaims(uid, {
        SuperAdmin: true,
      });
      return { msg: 'Success' };
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async getAllUsers(
    pages: number,
    search: string,
  ): Promise<IGetAllUserResponse> {
    const page: number = Number(pages) || 1;
    const searchQuery = search?.toString();
    const skip = (page - 1) * 10;

    try {
      const user = await this.prisma.user.findMany({
        skip,
        take: 10,
        where: {
          name: {
            contains: searchQuery,
            mode: 'insensitive',
          },
          role: 'User',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (searchQuery) {
        const numberOfPages = Math.ceil(user.length / 10);
        return { user, numberOfPages };
      } else {
        const totalUser = await this.prisma.user.count();
        const numberOfPages = Math.ceil(totalUser / 10);
        return { user, numberOfPages };
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }

  async deleteUser(id: string) {
    try {
      const findUser = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!findUser) {
        throw new BadRequestException('Something went wrong please try again!');
      } else {
        getAuth().deleteUser(id);

        await this.prisma.user.delete({
          where: { id },
        });
        return { msg: 'Successfully deleted!' };
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }

  async updateOne(id: string, data: Prisma.UserCreateInput) {
    if (data.password) {
      getAuth()
        .updateUser(id, {
          displayName: data.name,
          email: data.email,
          password: data.password,
          photoURL:
            'https://res.cloudinary.com/dyvisacbu/image/upload/v1664698266/Hotel%20User%20Image/1664698260709-account_ttr2cd.png',
        })
        .then(async (updatedUserData) => {
          const updatedUser = await this.prisma.user.update({
            where: {
              id,
            },
            data: {
              name: updatedUserData.displayName,
              date_of_birth: data.date_of_birth,
              gender: data.gender,
              email: updatedUserData.email,
              phone_number: data.phone_number,
            },
          });
          return { updatedUser, msg: 'Successfully updated rooms' };
        })
        .catch((error) => {
          if (error instanceof Error) {
            throw new BadRequestException({ errorMsg: error.message });
          } else {
            throw new BadRequestException({
              errorMsg: 'Unexpected error',
              error,
            });
          }
        });
    } else {
      getAuth()
        .updateUser(id, {
          displayName: data.name,
          email: data.email,
          photoURL:
            'https://res.cloudinary.com/dyvisacbu/image/upload/v1664698266/Hotel%20User%20Image/1664698260709-account_ttr2cd.png',
        })
        .then(async (updatedUserData) => {
          const updatedUser = await this.prisma.user.update({
            where: {
              id,
            },
            data: {
              name: updatedUserData.displayName,
              date_of_birth: data.date_of_birth,
              gender: data.gender,
              email: updatedUserData.email,
              phone_number: data.phone_number,
            },
          });
          return { updatedUser, msg: 'Successfully updated rooms' };
        })
        .catch((error) => {
          if (error instanceof Error) {
            throw new BadRequestException({ errorMsg: error.message });
          } else {
            throw new BadRequestException({
              errorMsg: 'Unexpected error',
              error,
            });
          }
        });
    }
  }
}
