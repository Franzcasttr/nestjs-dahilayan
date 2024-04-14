import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/module/prisma/prisma.service';
import { LoginWithEmailDto } from '../dto/login-with-email.dto';
import { UserDto } from '../dto/user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async currentUser(uid: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id: uid,
        },
        select: {
          id: true,
          image: true,
          phone_number: true,
          name: true,
          date_of_birth: true,
          gender: true,
          roles: true,
          email: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Something went wrong please try again');
    }
  }

  async loginWithEmailAndPassword(data: LoginWithEmailDto): Promise<string> {
    try {
      await this.prisma.user.create({
        data,
      });
      return 'Successfully created';
    } catch (error) {
      throw new BadRequestException('Something went wrong please try again');
    }
  }

  async loginWithGoogle(data: UserDto): Promise<string> {
    const name = data.displayName;
    const image = data.photoURL;
    const id = data.uid;
    const email = data.email;
    const findUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!findUser) {
      try {
        await this.prisma.user.create({
          data: {
            id,
            name,
            email,
            image,
          },
        });
        return 'Successfully created';
      } catch (error) {
        throw new BadRequestException('Something went wrong please try again');
      }
    } else {
      return;
    }
  }

  async updateOne(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<{ message: string }> {
    const { name, date_of_birth, gender, phone_number } = data;
    if (name) {
      try {
        await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            name,
          },
        });
        return { message: 'Successfully updated' };
      } catch (error) {
        if (error instanceof Error) {
          throw new BadRequestException(error.message);
        } else {
          throw new BadRequestException(
            'Something went wrong please try again later!',
          );
        }
      }
    }
    if (date_of_birth) {
      try {
        await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            date_of_birth,
          },
        });
        return { message: 'Successfully updated' };
      } catch (error) {
        if (error instanceof Error) {
          throw new BadRequestException(error.message);
        } else {
          throw new BadRequestException(
            'Something went wrong please try again later!',
          );
        }
      }
    }
    if (gender) {
      try {
        await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            gender,
          },
        });
        return { message: 'Successfully updated' };
      } catch (error) {
        if (error instanceof Error) {
          throw new BadRequestException(error.message);
        } else {
          throw new BadRequestException(
            'Something went wrong please try again later!',
          );
        }
      }
    }
    if (phone_number) {
      try {
        await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            phone_number,
          },
        });
        return { message: 'Successfully updated' };
      } catch (error) {
        if (error instanceof Error) {
          throw new BadRequestException(error.message);
        } else {
          throw new BadRequestException(
            'Something went wrong please try again later!',
          );
        }
      }
    }
  }
}
