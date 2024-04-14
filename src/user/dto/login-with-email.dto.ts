import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginWithEmailDto {
  @IsString()
  @IsNotEmpty()
  uid: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  image: string;
  date_of_birth: string;
  gender: string;
  phone_number: number;
}
