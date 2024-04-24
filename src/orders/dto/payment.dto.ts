import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  @IsString()
  userById: string;

  @IsNotEmpty()
  @IsString()
  check_in: string;

  @IsNotEmpty()
  @IsString()
  check_out: string;

  @IsNotEmpty()
  @IsString()
  room_type: string;

  @IsNotEmpty()
  @IsNumber()
  paid: number;

  @IsNotEmpty()
  @IsNumber()
  number_of_nights: number;

  @IsNotEmpty()
  @IsNumber()
  number_of_guest: number;
}
