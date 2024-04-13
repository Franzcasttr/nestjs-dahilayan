import { Roles } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  image: string;
  @Exclude()
  password: string;

  @IsNotEmpty()
  @IsEnum(Roles, { each: true })
  roles: Roles[];
}
