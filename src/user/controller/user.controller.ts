import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): string {
    return 'hello';
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return id;
  }

  @Post('signupuser')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserDto> {
    return this.userService.createUser(createUserDto);
  }
}
