import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,

  // UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { AdminUsersService } from '../services/admin-users.service';
import { IGetAllUserResponse } from '../interface/getAllUserResponse.interface';
import { UsersInterceptor } from '../interceptor/users.interceptor';
import { DeleteUserInterceptor } from '../interceptor/delete-user.interceptor';

import { Role } from 'src/decorators/Auth.decorator';

@Controller('api/v1/admin/users')
export class AdminUserController {
  constructor(private readonly usersService: AdminUsersService) {}

  @Post('create-user')
  // @Roles(['Admin'])
  // @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(UsersInterceptor)
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    // return "hello";
    return this.usersService.createUser(createUserDto);
  }

  @Post('set-custom-claims')
  @Role('Admin', 'SuperAdmin')
  setCustomClaim(@Body() uid: string, roles: string[]) {
    return this.usersService.setCustomClaim(uid, roles);
  }

  @Get()
  @Role('Admin', 'SuperAdmin')
  getAllUsers(
    @Query('pages') pages: number,
    @Query('search') search: string,
  ): Promise<IGetAllUserResponse> {
    return this.usersService.getAllUsers(pages, search);
  }

  // @Get('current-user')
  // @UseGuards(AuthGuard)
  // @UseInterceptors(UserInterceptor)
  // currentUser(@CurrentUser('displayName') name: string) {
  //   return `hello ${name}`;
  // }

  @Delete(':id')
  @Role('Admin')
  @UseInterceptors(DeleteUserInterceptor)
  deleteOne(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Put(':id')
  @Role('Admin', 'SuperAdmin')
  updateOne(@Param('id') id: string, @Body() data: CreateUserDto) {
    return this.usersService.updateOne(id, data);
  }
}
