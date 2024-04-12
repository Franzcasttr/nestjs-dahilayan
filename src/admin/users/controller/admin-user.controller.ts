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
// import { AuthGuard } from 'src/guards/auth.guard';
// import { Roles } from 'src/decorators/role.decorator';
// import { RolesGuard } from 'src/guards/role.guard';
import { Auth } from 'src/decorators/Auth.decorator';

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
  setCustomClaim(@Body() uid: string) {
    return this.usersService.setCustomClaim(uid);
  }

  @Get()
  @Auth('ADMIN')
  getAllUsers(
    @Query('pages') pages: number,
    @Query('search') search: string,
  ): Promise<IGetAllUserResponse> {
    return this.usersService.getAllUsers(pages, search);
  }

  @Delete(':id')
  @UseInterceptors(DeleteUserInterceptor)
  deleteOne(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() data: CreateUserDto) {
    return this.usersService.updateOne(id, data);
  }
}
