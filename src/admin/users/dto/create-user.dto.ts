import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  image: string;
  password: string;
}
