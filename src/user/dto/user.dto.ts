import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  uid: string;

  @IsString()
  displayName: string;

  @IsString()
  photoURL: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  emailVerified: boolean;
  @IsBoolean()
  disabled: boolean;
}
