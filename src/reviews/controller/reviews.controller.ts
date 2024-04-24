import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ReviewsService } from '../services/reviews.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Post('create-review')
  @UseGuards(AuthGuard)
  create(createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get('userReview')
  @UseGuards(AuthGuard)
  findMany(@CurrentUser('uid') uid: string) {
    return this.reviewService.findMany(uid);
  }
}
