import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FavoriteService } from '../services/favorite.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserInterceptor } from 'src/interceptors/user.interceptor';

@Controller('api/v1/favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('createFavorite')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  create(
    @CurrentUser('uid') uid: string,
    @Body('productID') productID: string,
  ) {
    return this.favoriteService.create(uid, productID);
  }

  @Get('getuserFavorite')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  findMany(@CurrentUser('uid') uid: string) {
    return this.favoriteService.findMany(uid);
  }

  @Put('removeFavorite')
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  remove(
    @CurrentUser('uid') uid: string,
    @Body('productID') productID: string,
  ) {
    return this.favoriteService.remove(uid, productID);
  }
}
