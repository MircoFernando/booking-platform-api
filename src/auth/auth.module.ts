import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy';
import { AppLogger } from '../common/logger/app-logger.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true, // makes JwtService available everywhere without re-importing JwtModule
      secret: process.env.JWT_SECRET || 'default-super-secret-key-change-in-production',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AppLogger],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
