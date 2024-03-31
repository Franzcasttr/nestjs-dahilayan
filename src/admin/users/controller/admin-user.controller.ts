import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { AdminUsersService } from '../services/admin-users.service';
import { IGetAllUserResponse } from '../interface/getAllUserResponse.interface';

@Controller('api/v1/admin/users')
export class AdminUserController {
  constructor(private readonly usersService: AdminUsersService) {}

  @Post('create-user')
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('set-custom-claims')
  setCustomClaim(@Body() uid: string) {
    return this.usersService.setCustomClaim(uid);
  }

  @Get()
  getAllUsers(
    @Query('pages') pages: number,
    @Query('search') search: string,
  ): Promise<IGetAllUserResponse> {
    return this.usersService.getAllUsers(pages, search);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() data: CreateUserDto) {
    return this.usersService.updateOne(id, data);
  }
}
