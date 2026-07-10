import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BookingsModule } from './bookings/bookings.module';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './auth/auth.module';
import { RequestIdMiddleware } from './common/middlewares/request-id.midleware';
import { AppLogger } from './common/logger/app-logger.service';

@Module({
  imports: [UserModule, BookingsModule, ServicesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, AppLogger],
})
export class AppModule {
  // Apply the middleware to all routes
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
