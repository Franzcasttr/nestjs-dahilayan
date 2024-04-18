import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { IGetAllUserResponse } from '../interface/getAllUserResponse.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { FirebaseAdmin } from 'src/config/firebase.setup';

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly admin: FirebaseAdmin,
  ) {}

  async createUser(
    data: CreateUserDto,
  ): Promise<{ result: CreateUserDto; msg: string }> {
    const app = this.admin.setup();
    const { roles } = data;
    if (!Array.isArray(roles)) {
      throw new BadRequestException('Roles must be an array');
    }
    try {
      const user = await app
        .auth()
        .createUser({
          displayName: data.name,
          email: data.email,
          password: data.password,
          photoURL:
            'https://res.cloudinary.com/dyvisacbu/image/upload/v1664698266/Hotel%20User%20Image/1664698260709-account_ttr2cd.png',
        })
        .then((user) => user);

      await app.auth().setCustomUserClaims(user.uid, { roles });

      const result = await this.prisma.user.create({
        data: {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          roles,
        },
      });
      return { result, msg: 'Successfully Created!' };
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong please try again later!',
      );
    }
  }

  async setCustomClaim(uid: string, roles: string[]) {
    const app = this.admin.setup();
    try {
      await app.auth().setCustomUserClaims(uid, {
        roles,
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
          roles: {
            has: 'User',
          },
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
    const app = this.admin.setup();
    try {
      await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      app.auth().deleteUser(id);

      await this.prisma.user.delete({
        where: { id },
      });
      return { msg: 'Successfully deleted!' };
    } catch (error) {
      console.log('Error ', error);
      if (error instanceof Error) {
        throw new BadRequestException({ errorMsg: error.message });
      } else {
        throw new BadRequestException({ errorMsg: 'Unexpected error', error });
      }
    }
  }

  async updateOne(id: string, data: Prisma.UserCreateInput) {
    const app = this.admin.setup();
    const { roles } = data;
    if (data.password) {
      app
        .auth()
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
              roles,
            },
          });
          if (updatedUser !== null || updatedUser !== undefined) {
            await app.auth().setCustomUserClaims(id, { roles });
          }
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
      app
        .auth()
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
              roles,
            },
          });
          if (updatedUser !== null || updatedUser !== undefined) {
            await app.auth().setCustomUserClaims(id, { roles });
          }
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
