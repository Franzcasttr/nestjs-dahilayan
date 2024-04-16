import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { AuthenticateMiddleware } from './middleware/authenticate.middleware';
import { PrismaModule } from 'src/module/prisma/prisma.module';
import { FirebaseAdmin } from 'src/config/firebase.setup';
import { CloudinaryModule } from 'src/cloudinary/services/cloudinary.module';

@Module({
  controllers: [UserController],
  providers: [UserService, FirebaseAdmin],
  imports: [PrismaModule, CloudinaryModule],
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
