import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserInterceptor } from 'src/interceptors/user.interceptor';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { LoginWithEmailDto } from '../dto/login-with-email.dto';
import { UserDto } from '../dto/user.dto';
import { Prisma } from '@prisma/client';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signupuser')
  async loginWithEmailAndPassword(@Body() createUserDto: LoginWithEmailDto) {
    return this.userService.loginWithEmailAndPassword(createUserDto);
  }

  @Post('saveuser')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  loginWithGoogle(@CurrentUser() userDetails: UserDto) {
    return this.userService.loginWithGoogle(userDetails);
  }

  @Get('showme')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  currentUser(@CurrentUser('uid') uid: string) {
    return this.userService.currentUser(uid);
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return id;
  }
  @Get(':id')
  updateOne(
    @Param('id') id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<{ message: string }> {
    return this.userService.updateOne(id, data);
  }
}
