import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
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
import { CloudinaryService } from 'src/cloudinary/services/cloudinary.service';
import fs from 'fs';

@Controller('api/v1/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private cloudinary: CloudinaryService,
  ) {}

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

  @Post('updateUserImage')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  async updateImage(
    @CurrentUser('uid') uid: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new ForbiddenException('Image file not found');
    if (file!.mimetype !== 'image/jpeg')
      throw new ForbiddenException('Image file is not supported');

    const uploadImage = async (url: string) =>
      await this.cloudinary.ImageUploader(url, 'Hotel User Image');
    const image = await uploadImage(file!.path);
    fs.unlinkSync(file!.path);

    return this.userService.updateImage(uid, image.secure_url);
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return id;
  }
  @Put(':id')
  @UseGuards(AuthGuard)
  updateOne(
    @Param('id') id: string,
    @Body() data: Prisma.UserUpdateInput,
  ): Promise<{ message: string }> {
    return this.userService.updateOne(id, data);
  }
}
