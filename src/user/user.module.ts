import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './user.service';
import { AuthenticateMiddleware } from './middleware/authenticate.middleware';
import { PrismaModule } from 'src/module/prisma/prisma.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticateMiddleware).forRoutes(
      {
        path: 'user',
        method: RequestMethod.GET,
      },
      {
        path: 'user',
        method: RequestMethod.POST,
      },
    );
  }
}
