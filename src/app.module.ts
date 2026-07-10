import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BookingsModule } from './bookings/bookings.module';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, BookingsModule, ServicesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
